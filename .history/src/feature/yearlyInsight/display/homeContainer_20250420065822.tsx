import DataTable from './dataTable';
import LeftGraph from './leftGraph';
import RightGraph from './rightGraph';
const HomeContainer = () => {
  return (
    <div className="space-y-6 ">
      {/* 上部の大きなカード */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <DataTable />
      </div>

      {/* 下部のグリッド */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <LeftGraph />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <RightGraph />
        </div>
      </div>
    </div>
  );
};

export default HomeContainer;
