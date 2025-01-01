import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks"
import { toast } from "react-toastify";
import Loading from "../../common/loading/Loading";
import { Link, useNavigate, useSearchParams } from "react-router";
import moment from "moment";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine, RiInformation2Line, RiPencilLine } from "react-icons/ri";
import { Modal, Tooltip } from "bootstrap";
import Select, { SingleValue } from "react-select";
import { selectStyle, optionRecord, Option } from "../../configs/select.config";
import { allBorrow } from "../../apis/actions/borrow.action";
import { reset, resetError } from "../../apis/slices/borrow.slice";
export const BorrowList = () => {
  const [searchParam] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, message, borrows, error, pagination, success } = useAppSelector((state) => state.borrow);
  const [keyword, setKeyword] = useState(searchParam.get("keyword") ?? undefined);
  const index = optionRecord.findIndex(
    (item) => item.value === parseInt(searchParam.get("view") ?? "10")
  );
  useEffect(() => {
    setKeyword(searchParam.get("keyword") ?? undefined)
    dispatch(allBorrow({ keyword: searchParam.get("keyword"), view: parseInt(searchParam.get("view") ?? "10"), page: parseInt(searchParam.get("page") ?? "1") }));
  }, [dispatch, searchParam]);
  useEffect(() => {
    let toolTipList = null;
    if (borrows.length > 0) {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      toolTipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));
    }
    return () => {
      if (toolTipList) {
        toolTipList.forEach(item => {
          item.hide();
        })
      }
      const modelElement = document.getElementById("modal-bookshop") as HTMLElement;
      if (modelElement) {
        const modal = new Modal(modelElement);
        modal.hide();
      }
    }
  }, [borrows]);
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
  }, [dispatch, error, message, success]);
  const handleSearch = () => {
    if (!keyword)
      searchParam.delete("keyword");
    else if (keyword.trim())
      searchParam.set("keyword", keyword);
    searchParam.delete("view");
    searchParam.delete("page");
    console.log(searchParam.toString());
    navigate(`?${searchParam.toString()}`)
    window.location.reload();
  }
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
  const statusContent: {
    [key: string]: {
      text: string;
      classColor: string;
    }
  } = {
    pending: {
      text: "Đang xử lý",
      classColor: "status-pending"
    },
    borrowed: {
      text: "Đã mượn",
      classColor: "status-borrowed"
    },
    failed: {
      text: "Từ chối",
      classColor: "status-error"
    },
    shipping: {
      text: "Đang giao",
      classColor: "status-shipping"
    },
    returned: {
      text: "Đã trả",
      classColor: "status-active"
    },
  }
  const getActiveEdit = (status: string, type: string ) : boolean => {
    return status === "pending" && type === "online";
  }
  return (
    <>
      {loading ?
        <Loading /> :
        <div>
          <div className="box-search mb-3">
            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Nhập tên hoặc code để tìm kiếm" />
            <button onClick={handleSearch} className="btn-fill rounded">Tìm kiếm</button>
          </div>
          <div className="box-handle mb-3">
            <Link to="/borrows/create" className="btn-fill rounded">Thêm mới</Link>
            <button className="btn-fill rounded">Xuất excel</button>
          </div>
          <div className="table-container rounded border">
            <div className="table-caption py-2">
              <div className="px-2">Tổng số bản ghi: <span className="">{pagination.total}</span></div>
            </div>
            <div className="table-responsive-container">
              <table className="table table-striped table-borderless mb-0 table-hover caption-top">

                <thead>
                  <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Tiêu đề</th>
                    <th scope="col">Code</th>
                    <th scope="col">Người mượn</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Thư viện</th>
                    <th scope="col">Ngày mượn - trả</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Kiểu đơn</th>
                    <th scope="col">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {borrows && borrows.length > 0 ? (
                    borrows.map((item, index) => (
                      <tr key={item._id}>
                        <td className="align-middle">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                        <td className="align-middle">{item.book.title}</td>
                        <td className="align-middle">{item.code}</td>
                        <td className="align-middle">{item.borrower.user.name}</td>
                        <td className="align-middle">{item.quantity}</td>
                        <td className="align-middle">{item.library.name}</td>
                        <td className="align-middle">{`${moment(item.borrow_date).format("DD/MM/yyy")} - ${moment(item.return_date).format("DD/MM/yyyy")}`}</td>
                        <td className="align-middle">
                          <div className={`rounded-pill py-1 px-2 d-flex align-items-center justify-content-center ${statusContent[item.status].classColor}`}>
                            <span >{statusContent[item.status].text}</span>
                          </div>
                        </td>
                        <td className="align-middle">{item.type}</td>
                        <td className="align-middle">
                          <div className="btn-group d-flex gap-2 align-items-center">
                            <Link className="btn-icon" to={`/borrows/view/${item._id}`} data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="View">
                              <div className="icon">
                                <RiInformation2Line />
                              </div>
                            </Link>
                            {getActiveEdit(item.status, item.type) && (
                              <Link className="btn-icon" to={`/borrows/edit/${item._id}`} data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Edit">
                                <div className="icon">
                                  <RiPencilLine />
                                </div>
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7}>
                        <p className="text-center mb-0">No data</p>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
            <div className="d-flex align-items-center justify-content-between p-2">
              <div className="display-record">
                <span>Hiển thị
                  <div className="select-record">
                    <Select
                      styles={selectStyle}
                      onChange={handleChangePerView}
                      value={optionRecord[index]}
                      isDisabled={borrows.length == 0}
                      options={optionRecord} />
                  </div>
                  bản ghi</span>
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
