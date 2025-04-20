export const exportToCsv = (filename: string, rows: Record<string, string | number>[]) => {
    if (!rows.length) return;
  
    const csvContent =
      Object.keys(rows[0]).join(',') + '\n' + rows.map(row =>
        Object.values(row).map(value =>
          `"${String(value).replace(/"/g, '""')}"` 
        ).join(',')
      ).join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  