"use client";
import { useState, useEffect } from "react";
import axiosInstance from "../lib/axiosInstance";


/**
 * Loads sections for the currently logged-in teacher.
 *
 * Strategy:
 *  1. GET /teachers/me
 *  2. If response contains assigned sections -> use them
 *  3. If empty (API not yet built) -> fallback to
 *     GET /sections?institutionId = <from teacher profile> & limit=100
 *
 * Returns: { sections, isLoading, error, isFallback }
 * isFallback = true means we used the institution-wide fallback
 */


export function useTeacherSections() {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // ----------------- Step 1: fetch teacher profile -----------------
        const meRes = await axiosInstance.get("/teachers/me");
        const me = meRes.data?.data;
        // console.log(meRes);

        // ----- Step 2: try to read assigned sections from the profile ------
        // Future API may return any of these keys
        const raw = me?.assignedSections
          ?? me?.sections
          ?? me?.teacherSections
          ?? [];

        // console.log(raw); //now its blank array

        const assigned = raw
          .map((item) => item.section ?? item)
          .filter((s) => s?.id);

        if (assigned.length > 0) {
          if (!cancelled) {
            setSections(assigned);
            setIsFallback(false);
          }
          return;
        }

        // ---- Step 3: fallback — all sections in teacher's institution ----
        const institutionId = me?.institutionId ?? me?.institution?.id;
        // console.log(institutionId);

        if (!institutionId) {
          if (!cancelled) {
            setError("প্রতিষ্ঠানের তথ্য পাওয়া যায়নি।");
          }
          return;
        }

        const secRes = await axiosInstance.get("/sections", {
          params:
          {
            institutionId,
            limit: 100
          },
        });
        // console.log(secRes);

        const fallbackSections = secRes.data?.data ?? [];
        //console.log(fallbackSections);

        if (!cancelled) {
          setSections(fallbackSections);
          setIsFallback(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ?? "সেকশন লোড করতে ব্যর্থ হয়েছে।"
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return { sections, isLoading, error, isFallback };
}