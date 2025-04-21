import DataTable from './dataTable';
import LeftGraph from './leftGraph';

const HomeContainer = () => {
  return (
    <div className="space-y-6">
      {/* 上部の大きなカード */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">年間パフォーマンス概要</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">総いいね数</p>
            <p className="text-2xl font-bold">12,345</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">総コメント数</p>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">平均エンゲージメント率</p>
            <p className="text-2xl font-bold">5.67%</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">フォロワー増加数</p>
            <p className="text-2xl font-bold">+2,345</p>
          </div>
        </div>
      </div>

      {/* 下部のグリッド */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">月別エンゲージメント推移</h2>
          <LeftGraph />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">投稿パフォーマンス</h2>
          <DataTable />
        </div>
      </div>
    </div>
  );
};

export default HomeContainer;
