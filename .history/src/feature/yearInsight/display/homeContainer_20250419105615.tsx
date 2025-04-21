import DataTable from './dataTable';
import LeftGraph from './leftGraph';
import RightGraph from './rightGraph';
const HomeContainer = () => {
  return (
    <div className="space-y-6">
      {/* 上部の大きなカード */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">年間パフォーマンス概要</h2>
        <DataTable />
      </div>

      {/* 下部のグリッド */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">月別エンゲージメント推移</h2>
          <LeftGraph />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">投稿パフォーマンス</h2>
          <RightGraph />
        </div>
      </div>
    </div>
  );
};

export default HomeContainer;
