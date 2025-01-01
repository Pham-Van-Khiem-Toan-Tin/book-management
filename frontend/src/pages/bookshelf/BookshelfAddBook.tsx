import { KeyboardEvent, useEffect, useState } from 'react'
import Select from 'react-select';
import { createSelectStyles } from '../../configs/select.config';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxhooks';
import { useDebounceCallback } from 'usehooks-ts';
import { selectBook } from '../../apis/actions/book.action';
import { RiDeleteBin5Line } from 'react-icons/ri';
import './bookshelf.css';
import { useNavigate, useParams } from 'react-router';
import { addBookToBookshelf, viewBookshelf } from '../../apis/actions/bookshelf.action';
import Loading from '../../common/loading/Loading';
import { toast } from 'react-toastify';
import { reset, resetError } from '../../apis/slices/bookshelf.slice';
import _ from "lodash";


interface BookShelfAddBook {
    bookId: string;
    bookName: string;
    code: string;
    quantity: number;
    image: string;
}
interface OptionObject {
    value: {
        _id: string;
        image: string;
    };
    label: string;
}
const BookshelfAddBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [disabled, setDisabled] = useState(false);
    const [bookList, setBookList] = useState<Array<BookShelfAddBook>>([]);
    const [bookKeyword, setBookKeyword] = useState<string | null>(null);
    const [selectedValue, setSelectedValue] = useState<OptionObject | null>(null);
    const { loading: loadingBook, bookSelects } = useAppSelector(state => state.book);
    const { loading, bookshelf, success, message, error } = useAppSelector(state => state.bookshelf);
    const dispatch = useAppDispatch();
    const handleSearchBook = useDebounceCallback((inputValue) => {
        if (bookshelf) {
            dispatch(selectBook({ keyword: inputValue, excludedBookIds: bookList.map((item) => item.bookId), categoryId: bookshelf.category._id }));
        }
    }, 500);
    const optionStyle = createSelectStyles<OptionObject>()
    useEffect(() => {
        if (id) {
            dispatch(viewBookshelf(id));
        }
    }, [dispatch, id]);
    useEffect(() => {
        if (bookshelf) {
            setBookList(bookshelf.books.map((item) => ({
                bookId: item.book._id,
                bookName: item.book.title,
                code: item.code,
                quantity: item.quantity,
                image: item.book.image.url,
            })));
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [bookshelf])
    useEffect(() => {
        if (success) {
            toast.success(message);
            dispatch(reset());
            setDisabled(true);
            setTimeout(() => {
                navigate("/bookshelves/all")
            }, 1500);
        } else if (error) {
            toast.error(message);
            setDisabled(false);
            dispatch(resetError());
        }
    }, [dispatch, success, error, navigate, message])
    const handleDelete = (bookId: string) => {
        if (bookshelf) {
            const newBookList = bookList.filter((item) => item.bookId !== bookId);
            setBookList(newBookList);
            dispatch(selectBook({ keyword: bookKeyword, excludedBookIds: newBookList.map((item) => item.bookId), categoryId: bookshelf.category._id }));
        }
    }
    const handleInputChange = (bookId: string, field: keyof BookShelfAddBook, value: string | number) => {
        setBookList((prevList) =>
            prevList.map((item) =>
                item.bookId === bookId
                    ? { ...item, [field]: field === "quantity" ? Number(value) : value }
                    : item
            )
        );
    };
    const handleInputNumber = (e: KeyboardEvent<HTMLInputElement>) => {
        const input = e.currentTarget.value;
        if (
            ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
        ) {
            return;
        }
        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
            return;
        }
        if (input.length === 0 && e.key === "0") {
            e.preventDefault();
        }
    }
    const handleInputSpace = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === " ") {
            e.preventDefault();
        }
    }
    const handleSubmit = () => {
        let checkData: boolean = false;
        const codeList = bookList.map((item) => item.code);
        const quantityList = bookList.map((item) => item.quantity);
        const checkCodeBlank = codeList.every((item) => item && item.trim() !== "");
        const isUniqueCode = new Set(codeList).size == codeList.length;
        const checkQuantity = quantityList.every((item) => item > 0);
        if (checkCodeBlank && checkQuantity && isUniqueCode) checkData = true;
        if (!bookshelf) {
            toast.error("Không thể thêm sách vào giá. Vui lòng thử lại sau!");
            return;
        }
        if (!checkData) {
            toast.error("Dữ liệu không hợp lệ");
            return;
        }
        const isChange = _.isEqual(bookList, bookshelf.books.map((item) => ({
            bookId: item.book._id,
            bookName: item.book.title,
            code: item.code,
            quantity: item.quantity,
        })))
        if (isChange) {
            toast.error("Bạn chưa thay đổi dữ liệu!");
            return;
        }
        dispatch(addBookToBookshelf({ books: bookList, bookshelfId: bookshelf._id }))


    }
    return (
        <>
            {
                loading ? (<Loading />) :
                    (
                        <div className='form-create rounded p-2 d-flex flex-column justify-content-between'>
                            <div>
                                <div className='box-input' >
                                    <label htmlFor="bookshelf">Thư viện</label>
                                    <span className='span-input'>{bookshelf?.bookcase.library.name}</span>
                                </div>
                                <div className='box-input' >
                                    <label htmlFor="bookshelf">Tủ sách</label>
                                    <span className='span-input'>{`${bookshelf?.bookcase.code} - ${bookshelf?.bookcase.name}`}</span>
                                </div>
                                <div className='box-input' >
                                    <label htmlFor="bookshelf">Giá sách</label>
                                    <span className='span-input'>{`${bookshelf?.code} - ${bookshelf?.name}`}</span>
                                </div>
                                <div className='box-input'>
                                    <label htmlFor='search'>Tìm kiếm sách: </label>
                                    <Select
                                        styles={optionStyle}
                                        isLoading={loadingBook}
                                        value={selectedValue}
                                        onInputChange={(value, action) => {
                                            if (action.action === 'input-change') {
                                                if (value && bookshelf) {
                                                    handleSearchBook(value);
                                                }
                                            }
                                            setBookKeyword(value);
                                        }}
                                        onChange={(value) => {
                                            if (value && bookshelf) {
                                                const newBookList = [...bookList, {
                                                    bookId: value.value._id,
                                                    bookName: value.label,
                                                    code: '',
                                                    quantity: 1,
                                                    image: value.value.image
                                                }];
                                                setBookList(newBookList);
                                                setSelectedValue(null);
                                                setBookKeyword(null);
                                                dispatch(selectBook({ keyword: null, excludedBookIds: newBookList.map((item) => item.bookId), categoryId: bookshelf.category._id }));
                                            }
                                        }}
                                        inputId='search'
                                        noOptionsMessage={() => 'Không tìm thấy sách'}
                                        placeholder='Nhập tên sách để tìm kiếm'
                                        filterOption={null}
                                        options={bookSelects.map((book) => ({
                                            value: {
                                                _id: book._id,
                                                image: book.image.url
                                            }, label: book.title
                                        }))}
                                    />
                                </div>
                                <div >
                                    <div className="table-container rounded border">
                                        <div className="table-responsive-container">
                                            <table className="table table-sm table-striped table-borderless mb-0">
                                                <thead className='bg-light'>
                                                    <tr>
                                                        <th scope='col'>STT</th>
                                                        <th scope='col'>Ảnh</th>
                                                        <th scope="col">Tên sách</th>
                                                        <th scope="col">Mã sách</th>
                                                        <th scope="col">Số lượng</th>
                                                        <th scope='col'>Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bookList && bookList.length > 0 ? (
                                                        bookList.map((item, index) => (
                                                            <tr key={item.bookId}>
                                                                <td className="align-middle">
                                                                    {index + 1}
                                                                </td>
                                                                <td className='align-middle'>
                                                                    <img src={item.image} alt='image-preview' className="img-fluid" style={{ width: "50px", maxHeight: "70px" }} />
                                                                </td>
                                                                <td className="align-middle">
                                                                    <input type="text" disabled value={item.bookName} />
                                                                </td>
                                                                <td className="align-middle">
                                                                    <input type="text"
                                                                        onChange={(e) =>
                                                                            handleInputChange(item.bookId, "code", e.target.value)
                                                                        }
                                                                        onKeyDown={handleInputSpace}
                                                                        value={item.code} />
                                                                </td>
                                                                <td className="align-middle">
                                                                    <input type="text"
                                                                        onChange={(e) =>
                                                                            handleInputChange(item.bookId, "quantity", e.target.value)
                                                                        }
                                                                        onKeyDown={handleInputNumber}
                                                                        value={item.quantity} />
                                                                </td>
                                                                <td className='align-middle'>
                                                                    <button onClick={() => handleDelete(item.bookId)} className="btn-icon text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Delete">
                                                                        <div className="icon">
                                                                            <RiDeleteBin5Line />
                                                                        </div>
                                                                    </button>
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
                                    </div>
                                </div>
                            </div>
                            <div className='btn-group d-flex justify-content-end gap-2'>
                                <button disabled={disabled} onClick={handleSubmit} className="btn-fill rounded px-3 py-2">Save</button>
                                <button className="btn-border rounded px-3 py-2">Cancel</button>
                            </div>
                        </div>
                    )
            }
        </>
    )
}

export default BookshelfAddBook