const DataTable = () => {
  const data = [
    {
      date: '2024/03/01',
      likes: 234,
      comments: 12,
      engagement: '4.5%'
    },
    {
      date: '2024/02/28',
      likes: 189,
      comments: 8,
      engagement: '3.8%'
    },
    {
      date: '2024/02/27',
      likes: 312,
      comments: 15,
      engagement: '5.2%'
    }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">投稿日</th>
            <th className="px-4 py-2 text-left">いいね数</th>
            <th className="px-4 py-2 text-left">コメント数</th>
            <th className="px-4 py-2 text-left">エンゲージメント率</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{row.date}</td>
              <td className="px-4 py-2">{row.likes}</td>
              <td className="px-4 py-2">{row.comments}</td>
              <td className="px-4 py-2">{row.engagement}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 