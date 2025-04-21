import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-100 h-screen fixed left-0 top-0 p-4">
      <div className="mb-8">
        <Link href="/" className="text-xl font-bold">
          AnalyGram
        </Link>
      </div>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">年間インサイト</h2>
          <ul className="space-y-2">
            <li><Link href="/yearly/feed">年間フィード</Link></li>
            <li><Link href="/yearly/stories">年間ストーリーズ</Link></li>
            <li><Link href="/yearly/ads">年間広告</Link></li>
          </ul>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">月間インサイト</h2>
          <ul className="space-y-2">
            <li><Link href="/monthly/feed">月間フィード</Link></li>
            <li><Link href="/monthly/stories">月間ストーリーズ</Link></li>
            <li><Link href="/monthly/ads">月間広告</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 