import { Link, useNavigate, useSearchParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxhooks";
import { useEffect, useState } from "react";
import { allLibrary, deleteLibrary, Library } from "../../../apis/actions/library.action";
import { SingleValue, StylesConfig } from "react-select";
import { Modal, Tooltip } from "bootstrap";
import { toast } from "react-toastify";
import { reset, resetError } from "../../../apis/slices/library/library.slice";
import Loading from "../../../common/loading/Loading";
import moment from "moment";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine, RiDeleteBin5Line, RiInformation2Line, RiPencilLine } from "react-icons/ri";
import Select from "react-select";
import ModalBs from "../../../common/modal/Modal";
import { CiWarning } from "react-icons/ci";


interface Option {
  value: number;
  label: number;
}
const LibraryList = () => {
  const selectStyle: StylesConfig<Option, false> = {
    control: (baseStyles) => ({
      ...baseStyles,
      border: '1px solid #ececec',
      boxShadow: 'none',
      minWidth: '72px',
      padding: '0rem 0.6rem',
      margin: '0 0.2rem',
      fontSize: '0.9rem',
      "&:hover": {
        borderColor: '#ececec'
      }
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      paddingBlock: 0,
      paddingRight: 0

    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: 0
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#a6a6a6',
      fontWeight: 300,
      margin: 0
    }),
    option: (provided, state) => ({
      ...provided,
      padding: '0.2rem 0.6rem',
      fontSize: '0.9rem',
      cursor: 'pointer',
      backgroundColor: state.isSelected ? '#00b207' : 'transparent',
      "&:hover": {
        backgroundColor: state.isSelected ? '#00b207' : '#dae5da'
      }
    })
  }
  const optionRecord = [
    {
      value: 10,
      label: 10
    },
    {
      value: 15,
      label: 15
    },
    {
      value: 20,
      label: 20
    },
  ]
  const [searchParam] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, libraries, pagination, error, success, message } = useAppSelector((state) => state.library);
  const [keyword, setKeyword] = useState(searchParam.get("keyword") ?? undefined);
  const [libraryDelete, setLibraryDelete] = useState<Library | null>(null);
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
  const toggleModalDelete = (item: Library) => {
    const modelElement = document.getElementById("modal-bookshop") as HTMLElement;
    const modal = new Modal(modelElement);
    setLibraryDelete(item);
    modal.toggle();
  };
  const handleDelete = () => {
    if (libraryDelete) dispatch(deleteLibrary(libraryDelete?._id))
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
                        <td className="align-middle">{index + 1}</td>
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
                            <button onClick={() => toggleModalDelete(item)} className="btn-icon text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Delete">
                              <div className="icon">
                                <RiDeleteBin5Line />
                              </div>
                            </button>
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
          <ModalBs maxWidth="500px">
            <div className="d-flex flex-column align-items-center justify-content-center py-4">
              <div className="icon mb-2">
                <CiWarning />
              </div>
              <h5 className="text-danger">Delete</h5>
              <span className="d-inline-block mb-4">Are you sure you would like to delete category {libraryDelete?.name}?</span>
              <div className="btn-group d-flex align-items-center justify-content-center gap-4">
                <button className="btn-base btn-fill px-3 py-2 rounded" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                <button onClick={handleDelete} className="btn-base btn-border px-3 py-2 rounded text-danger border-danger" data-bs-dismiss="modal" aria-label="Close">Delete</button>
              </div>
            </div>
          </ModalBs>
        </div>
      }
    </>
  )
}

export default LibraryList