const ThemeSwitcher = () => {
  const changeTheme = (themeName) => {
    // Set 'red', 'blue', or '' (for default)
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('selected-theme', themeName);
  };

  return (
    <div className="flex gap-2 p-4 bg-white shadow rounded-lg">
      <button onClick={() => changeTheme('')} className="w-6 h-6 bg-emerald-700 rounded-full border" title="Default" />
      <button onClick={() => changeTheme('red')} className="w-6 h-6 bg-red-700 rounded-full border" title="Red Theme" />
      <button onClick={() => changeTheme('blue')} className="w-6 h-6 bg-blue-900 rounded-full border" title="Blue Theme" />
    </div>
  );
};

export default ThemeSwitcher;