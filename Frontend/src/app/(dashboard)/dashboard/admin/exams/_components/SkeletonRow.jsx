const SkeletonRow = () => (
  <tr className="border-b border-gray-50">
    {[48, 28, 24, 30, 36, 24, 28].map((w, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-4 bg-gray-100 rounded-lg animate-pulse" style={{ width: `${w * 3}px` }} />
      </td>
    ))}
  </tr>
);

export default SkeletonRow;