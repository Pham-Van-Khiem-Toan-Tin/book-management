import { Link, useNavigate, useSearchParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks";
import { useEffect, useState } from "react";
import { allLibrary } from "../../apis/actions/library.action";
import Select, { SingleValue } from "react-select";
import { Tooltip } from "bootstrap";
import { toast } from "react-toastify";
import { reset, resetError } from "../../apis/slices/library.slice";
import Loading from "../../common/loading/Loading";
import moment from "moment";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine, RiInformation2Line, RiPencilLine } from "react-icons/ri";
import { selectStyle, optionRecord, Option } from "../../configs/select.config";



const LibraryList = () => {

  const [searchParam] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, libraries, pagination, error, success, message } = useAppSelector((state) => state.library);
  const [keyword, setKeyword] = useState(searchParam.get("keyword") ?? undefined);
  const index = optionRecord.findIndex((option) => option.value === (searchParam.get("view") ? parseInt(searchParam.get("view")!) : 10));
  useEffect(() => {
    setKeyword(searchParam.get("keyword") ?? undefined);
    dispatch(allLibrary({ keyword: searchParam.get("keyword"), page: searchParam.get("page") ? parseInt(searchParam.get("page")!) : 1, view: searchParam.get("view") ? parseInt(searchParam.get("view")!) : 10 }));
  }, [searchParam, dispatch]);
  useEffect(() => {
    let toolTipList = null;
    if (libraries.length > 0) {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      toolTipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));
    }
    return () => {
      toolTipList?.forEach((tooltip) => {
        tooltip.dispose()
      });
    }
  }, [libraries]);
  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(reset());
      window.location.reload();
    }
    if (error) {
      toast.error(message);
      dispatch(resetError());
    }
  }, [success, error, message, dispatch]);
  const handleSearch = () => {
    if (!keyword) {
      searchParam.delete("keyword");
    } else if (keyword.trim()) {
      searchParam.set("keyword", keyword);
    }
    searchParam.delete("page");
    searchParam.delete("view");
    navigate(`?${searchParam.toString()}`);
    window.location.reload();
  };
  const handleChangePerView = (data: SingleValue<Option>) => {
    const recordNumber = optionRecord.find((item) => item.value == data?.value) || optionRecord[0];
    searchParam.set("view", JSON.stringify(recordNumber.value));
    searchParam.delete("page");
    navigate(`?${searchParam.toString()}`)
    window.location.reload();

  }
  const handleChangePage = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= pagination.totalPages) {
      searchParam.set("page", JSON.stringify(pageNumber));
      navigate(`?${searchParam.toString()}`)
      window.location.reload();

    }
  }
  return (
    <>
      {loading ?
        <Loading /> :
        <div>
          <div className="box-search mb-3">
            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search by name" />
            <button onClick={handleSearch} className="btn-fill rounded">Search</button>
          </div>
          <div className="box-handle mb-3">
            <Link to="/libraries/create" className="btn-fill rounded">Create</Link>
            <button className="btn-fill rounded">Export</button>
          </div>
          <div className="table-container rounded border">
            <div className="table-caption py-2">
              <div className="px-2">Total records: <span className="">{pagination.total}</span></div>
            </div>
            <div className="table-responsive-container">
              <table className="table table-striped table-borderless mb-0 table-hover caption-top">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Location</th>
                    <th scope="col">Created at</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {libraries && libraries.length > 0 ? (
                    libraries.map((item, index) => (
                      <tr key={item._id}>
                        <td className="align-middle">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                        <td className="align-middle">{item.name}</td>
                        <td className="align-middle">{item.location}</td>
                        <td className="align-middle">{moment(item?.createdAt).format("DD-MM-YYYY")}</td>
                        <td className="align-middle">
                          <div className="btn-group d-flex gap-2 align-items-center">
                            <Link className="btn-icon" to={`/libraries/view/${item._id}`} data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="View">
                              <div className="icon">
                                <RiInformation2Line />
                              </div>
                            </Link>
                            <Link className="btn-icon" to={`/libraries/edit/${item._id}`} data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Edit">
                              <div className="icon">
                                <RiPencilLine />
                              </div>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        <p className="text-center mb-0">No data</p>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
            <div className="d-flex align-items-center justify-content-between p-2">
              <div className="display-record">
                <span>Display
                  <div className="select-record">
                    <Select
                      styles={selectStyle}
                      onChange={handleChangePerView}
                      value={optionRecord[index]}
                      isDisabled={libraries.length === 0}
                      options={optionRecord} />
                  </div>
                  record</span>
              </div>
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item">
                  <button className="page-link" disabled={pagination.page == 1} onClick={() => handleChangePage(pagination.page - 1)} aria-label="Previous">
                    <RiArrowLeftDoubleLine />
                  </button>
                </li>
                {pagination.page > 1 && (
                  <li className="page-item">
                    <button className="page-link" onClick={() => handleChangePage(pagination.page - 1)}>{pagination.page - 1}</button>
                  </li>
                )}
                <li className="page-item">
                  <button className="page-link" disabled>{pagination.page}</button>
                </li>
                {pagination.page + 1 <= pagination.totalPages && (
                  <li className="page-item">
                    <button className="page-link" onClick={() => handleChangePage(pagination.page + 1)}>{pagination.page + 1}</button>
                  </li>
                )}
                <li className="page-item">
                  <button className="page-link" onClick={() => handleChangePage(pagination.page + 1)} disabled={pagination.page == pagination.totalPages} aria-label="Next">
                    <RiArrowRightDoubleLine />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default LibraryList