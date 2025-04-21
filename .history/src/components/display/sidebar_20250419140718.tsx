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
          <Link href="/yearly">
            <h2 className="text-lg font-semibold mb-2">年間インサイト</h2>
          </Link>
          <ul className="space-y-2">
            <li><Link href="/yearly/feed">年間フィード</Link></li>
            <li><Link href="/yearly/story">年間ストーリー</Link></li>
            <li><Link href="/yearly/reel">年間リール</Link></li>
          </ul>
        </div>
        
        <div>
          <Link href="/monthly">
            <h2 className="text-lg font-semibold mb-2">月間インサイト</h2>
          </Link>
          <ul className="space-y-2">
            <li><Link href="/monthly/master">月間マスター</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 