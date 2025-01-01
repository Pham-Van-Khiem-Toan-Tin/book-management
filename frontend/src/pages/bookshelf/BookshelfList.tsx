import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks"
import { toast } from "react-toastify";
import Loading from "../../common/loading/Loading";
import { Link, useNavigate, useSearchParams } from "react-router";
import moment from "moment";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine, RiDeleteBin5Line, RiHealthBookLine, RiInformation2Line, RiPencilLine } from "react-icons/ri";
import { Modal, Tooltip } from "bootstrap";
import Select, { SingleValue } from "react-select";
import ModalBs from "../../common/modal/Modal";
import { CiWarning } from "react-icons/ci";
import { selectStyle, optionRecord, Option } from "../../configs/select.config";
import { allBookshelf, Bookshelf, deleteBookshelf } from "../../apis/actions/bookshelf.action";
import { reset, resetError } from "../../apis/slices/bookshelf.slice";

const BookshelfList = () => {
    const [searchParam] = useSearchParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, message, bookshelves, error, pagination, success } = useAppSelector((state) => state.bookshelf);
    const [keyword, setKeyword] = useState(searchParam.get("keyword") ?? undefined);
    const [categoryDelete, setCategoryDelete] = useState<Bookshelf | null>(null);
    const index = optionRecord.findIndex(
        (item) => item.value === parseInt(searchParam.get("view") ?? "10")
    );

    useEffect(() => {
        setKeyword(searchParam.get("keyword") ?? undefined)
        dispatch(allBookshelf({ keyword: searchParam.get("keyword"), view: parseInt(searchParam.get("view") ?? "10"), page: parseInt(searchParam.get("page") ?? "1") }));
    }, [dispatch, searchParam]);
    useEffect(() => {
        let toolTipList = null;
        if (bookshelves.length > 0) {
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
    }, [bookshelves])

    useEffect(() => {
        if (success) {
            toast.success(message);
            dispatch(reset());
            setTimeout(() => {
                window.location.reload();
            }, 1500);
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
    const toggleModalDelete = (item: Bookshelf) => {
        const modelElement = document.getElementById("modal-bookshop") as HTMLElement;
        const modal = new Modal(modelElement);
        setCategoryDelete(item);
        modal.toggle();
    };
    const handleDelete = () => {
        if (categoryDelete) dispatch(deleteBookshelf(categoryDelete?._id))
    }
    return (
        <>
            {loading ?
                <Loading /> :
                <div>
                    <div className="box-search mb-3">
                        <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm kiếm theo tên" />
                        <button onClick={handleSearch} className="btn-fill rounded">Tìm kiếm</button>
                    </div>
                    <div className="box-handle mb-3">
                        <Link to="/bookshelves/create" className="btn-fill rounded">Thêm mới</Link>
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
                                        <th scope="col">Tên giá sách</th>
                                        <th scope="col">Tủ sách</th>
                                        <th scope="col">Thư viện</th>
                                        <th scope="col">Thời gian tạo</th>
                                        <th scope="col">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookshelves && bookshelves.length > 0 ? (
                                        bookshelves.map((item, index) => (
                                            <tr key={item._id}>
                                                <td className="align-middle">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                                                <td className="align-middle">{`${item.code} - ${item.name}`}</td>
                                                <td className="align-middle">{`${item.bookcase.code} - ${item.bookcase.name}`}</td>
                                                <td className="align-middle">{item.bookcase.library.name}</td>
                                                <td className="align-middle">{moment(item?.createdAt).format("DD-MM-YYYY")}</td>
                                                <td className="align-middle">
                                                    <div className="btn-group d-flex gap-2 align-items-center">
                                                        <Link className="btn-icon" to={`/bookshelves/view/${item._id}`} data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="View">
                                                            <div className="icon">
                                                                <RiInformation2Line />
                                                            </div>
                                                        </Link>
                                                        <Link className="btn-icon" to={`/bookshelves/edit/${item._id}`} data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Edit">
                                                            <div className="icon">
                                                                <RiPencilLine />
                                                            </div>
                                                        </Link>
                                                        <Link className="btn-icon" to={`/bookshelves/${item._id}/book/add`} data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Add book">
                                                            <div className="icon">
                                                                <RiHealthBookLine />
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
                                            <td colSpan={6}>
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
                                            isDisabled={bookshelves.length == 0}
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
                    <div className="modal-delete">
                        <ModalBs maxWidth="500px">
                            <div className="d-flex flex-column align-items-center justify-content-center py-4">
                                <div className="icon mb-2">
                                    <CiWarning />
                                </div>
                                <h5 className="text-danger">Delete</h5>
                                <span className="d-inline-block mb-4">Are you sure you would like to delete category {categoryDelete?.name}?</span>
                                <div className="btn-group d-flex align-items-center justify-content-center gap-4">
                                    <button className="btn-base btn-fill px-3 py-2 rounded" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                                    <button onClick={handleDelete} className="btn-base btn-border px-3 py-2 rounded text-danger border-danger" data-bs-dismiss="modal" aria-label="Close">Delete</button>
                                </div>
                            </div>
                        </ModalBs>
                    </div>
                </div>
            }
        </>
    )
}

export default BookshelfList