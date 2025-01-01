import Select from "react-select"
import { createSelectStyles } from "../../configs/select.config"
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks";
import { useDebounceCallback } from "usehooks-ts";
import { allReader } from "../../apis/actions/user.action";
import { KeyboardEvent, useEffect, useState } from "react";
import { allBookOfLibrary } from "../../apis/actions/book.action";
import { RiCalendarLine, RiDeleteBin5Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { createBorrowOffline } from "../../apis/actions/borrow.action";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import moment from "moment";
import { reset, resetError } from "../../apis/slices/borrow.slice";
import { useNavigate } from "react-router";
interface OptionObject {
  label: string;
  value: {
    _id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };
}
interface OptionBookObject {
  value: {
    _id: string;
    image: string;
    title: string;
    code: string;
    maxQuantity: number;
    bookshelf: string;
    type: string;
  };
  label: string;
}
interface BorrowCreate {
  user: {
    _id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };
  email: string;
  phone: string;
}
interface BookOfBorrow {
  bookId: string;
  maxQuantity: number;
  quantity: number;
  code: string;
  title: string;
  image: string;
  type: string;
  bookshelf: string;
  returnDate: Date | null;
}
const BorrowCreate = () => {
  registerLocale('vi', vi);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [bookList, setBookList] = useState<Array<BookOfBorrow>>([]);
  const [disabled, setDisabled] = useState(false);
  const [selectedValue, setSelectedValue] = useState<OptionBookObject | null>(null);
  const selectOptionsString = createSelectStyles<OptionObject>();
  const selectOptionsBook = createSelectStyles<OptionBookObject>();
  const { handleSubmit, setValue, control, formState: { errors } } = useForm<BorrowCreate>();
  const { loading: loadingReader, readers } = useAppSelector((state) => state.user);
  const { loading: loadingBook, bookOfLibrary } = useAppSelector((state) => state.book);
  const { error, message, success } = useAppSelector((state) => state.borrow);
  const { library } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const handleSearchReader = useDebounceCallback((val: string) => {
    dispatch(allReader(val));
  }, 500);
  const navigate = useNavigate();
  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(reset());
      setTimeout(() => {
        navigate("/borrows/all");
      }, 1500);
    } else if (error) {
      toast.error(message);
      dispatch(resetError());
      setDisabled(false);
    }
  }, [dispatch, success, error, message, navigate]);

  const handleSearchBook = useDebounceCallback((val: string) => {
    if (library) dispatch(allBookOfLibrary({
      keyword: val, libraryId: library, bookSelected: bookList.map((item) => ({
        bookId: item.bookId,
        bookshelfId: item.bookshelf
      }))
    }));
  }, 500);
  const handleInputChange = (
    bookId: string,
    code: string,
    field: keyof BookOfBorrow,
    value: number | Date | null,
    maxValue: number | null
  ) => {
    setBookList((prevList) =>
      prevList.map((item) => {
        if (item.bookId === bookId && item.code === code) {
          if (maxValue && field === "quantity") {
            return ({
              ...item,
              [field]: Number(value) < maxValue
                ? Number(value)
                : maxValue
            });
          }
          return ({ ...item, [field]: value });
        }
        return item;
      }));
  };
  const handleKeydown = (event: KeyboardEvent<HTMLInputElement>) => {
    const key = event.key;
    const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
    if (!/^[0-9]$/.test(key) && !allowedKeys.includes(key)) {
      event.preventDefault();
    }
  };
  const handleDelete = (bookId: string, code: string) => {
    if (library) {
      setBookList((prevList) => prevList.filter((item) => !(item.bookId == bookId && item.code == code)));
      dispatch(allBookOfLibrary({
        keyword: keyword, libraryId: library, bookSelected: bookList.filter((item) => item.bookId !== bookId).map((item) => ({
          bookId: item.bookId,
          bookshelfId: item.bookshelf
        }))
      }));
    }
  }
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
  const onSubmit: SubmitHandler<BorrowCreate> = (data): void => {
    let checkData: boolean = false;
    if (bookList.length == 0 || !library) {
      toast.error("Vui lòng chọn sách");
      return;
    }
    let totalComic = 0;
    let totalTextbook = 0;
    bookList.forEach((item) => {
      if (item.type == "comic") {
        totalComic += 1;
      } else if (item.type == "novel") {
        totalTextbook += 1;
      }
      if (item.quantity <= item.maxQuantity) {
        checkData = true;
      }
    });
    if (totalComic > 6 || totalTextbook > 3) {
      toast.error("Sách truyện tranh và sách giáo trình không được mượn nhiều hơn 1 cuốn");
      return;
    }
    if (!checkData) {
      toast.error("Số lượng sách mượn không hợp lệ");
      return;
    }
    setDisabled(true);
    dispatch(createBorrowOffline({
      userId: data.user._id,
      email: data.email,
      phone: data.phone,
      books: bookList.map((item) => ({
        id: item.bookId,
        quantity: item.quantity,
        library: library,
        code: item.code,
        returnDate: new Date(),
        bookshelf: item.bookshelf
      }))
    }));
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="form-create rounded p-2 d-flex flex-column justify-content-between">
      <div>
        <div className="box-input">
          <label htmlFor="borrower">Người mượn: <span className="text-danger">*</span></label>
          <Controller
            name="user"
            control={control}
            rules={{ required: "Vui lòng chọn người mượn" }}
            render={({ field }) => (
              <Select
                styles={selectOptionsString}
                placeholder="Nhập tên hoặc email để tìm kiếm"
                noOptionsMessage={() => "Không tìm thấy người mượn"}
                isLoading={loadingReader}
                onInputChange={(val, action) => {
                  if (action.action == "input-change") {
                    handleSearchReader(val);
                  }
                }}
                options={readers.map((item) => ({
                  label: `${item.name} ${item?.phone ?? ""}`,
                  value: {
                    _id: item._id,
                    name: item.name,
                    email: item?.email,
                    phone: item?.phone
                  }
                }))}
                inputId="borrower"
                onChange={(val) => {
                  if (val?.value.email) setValue("email", val.value.email);
                  if (val?.value.phone) setValue("phone", val.value.phone);
                  field.onChange(val?.value)
                }}
                filterOption={null}
                isClearable
              />
            )}
          />
          {errors.user && <span className="input-error">{errors?.user?.message}</span>}
        </div>
        <div className="box-input">
          <label htmlFor="email">Email: <span className="text-danger">*</span></label>
          <input {...control.register("email", {
            required: "Vui lòng nhập email",
            validate: (value) => {
              if (value.trim() == "") {
                return "Vui lòng nhập email";
              } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                return "Email không hợp lệ";
              }
            }
          })} type="text" placeholder="Nhập địa chỉ email" />
          {errors.email && <span className="input-error">{errors?.email?.message}</span>}
        </div>
        <div className="box-input">
          <label htmlFor="phone">Số điện thoại: <span className="text-danger">*</span></label>
          <input {...control.register("phone", {
            required: "Vui lòng nhập số điện thoại",
            validate: (value) => {
              if (value.trim() == "") {
                return "Vui lòng nhập số điện thoại";
              } else if (!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(value)) {
                return "Số điện thoại không hợp lệ";
              }
            }
          })} type="text" maxLength={12} onKeyDown={handleKeydown} placeholder="Nhập số điện thoại" />
          {errors.phone && <span className="input-error">{errors?.phone?.message}</span>}
        </div>
        <div className="box-input">
          <label htmlFor="search-book">Chọn sách: <span className="text-danger">*</span></label>
          <Select
            loadingMessage={() => "Đang tìm kiếm sách"}
            isLoading={loadingBook}
            styles={selectOptionsBook}
            placeholder="Nhập mã hoặc tên sách để tìm kiếm"
            inputId="search-book"
            noOptionsMessage={() => "Không tìm thấy sách"}
            filterOption={null}
            value={selectedValue}
            onInputChange={(val, action) => {
              if (action.action == "input-change") {
                handleSearchBook(val);
              }
              setKeyword(val);
            }}
            onChange={(val) => {
              if (val && library) {
                const newBookList = [...bookList, {
                  bookId: val.value._id,
                  maxQuantity: val.value.maxQuantity,
                  quantity: 1,
                  code: val.value.code,
                  title: val.value.title,
                  image: val.value.image,
                  bookshelf: val.value.bookshelf,
                  type: val.value.type,
                  returnDate: new Date()
                }];
                setBookList(newBookList);
                setSelectedValue(null);
                dispatch(allBookOfLibrary({
                  keyword: null, libraryId: library, bookSelected: newBookList.map((item) => ({
                    bookId: item.bookId,
                    bookshelfId: item.bookshelf
                  }))
                }));
              }
            }}
            options={bookOfLibrary?.map((item) => ({
              value: {
                _id: item.bookId,
                image: item.image,
                title: item.bookTitle,
                code: item.code,
                maxQuantity: item.quantity,
                bookshelf: item.bookshelfId,
                returnDate: new Date(),
                type: item.type
              },
              label: `${item.code}: ${item.bookTitle}`
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
                    <th scope="col">Tồn kho</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Ngày trả</th>
                    <th scope='col'>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {bookList && bookList.length > 0 ? (
                    bookList.map((item, index) => (
                      <tr key={item.code}>
                        <td className="align-middle">
                          {index + 1}
                        </td>
                        <td className='align-middle'>
                          <img src={item.image} alt='image-preview' className="img-fluid" style={{ width: "50px", maxHeight: "70px" }} />
                        </td>
                        <td className="align-middle">
                          <input type="text" disabled value={item.title} />
                        </td>
                        <td className="align-middle">
                          <input type="text" disabled value={item.code} />
                        </td>
                        <td className="align-middle">
                          <input type="text" disabled value={item.maxQuantity} />
                        </td>
                        <td className="align-middle">
                          <input type="text"
                            onChange={(e) =>
                              handleInputChange(item.bookId, item.code, "quantity", Number(e.target.value), item.maxQuantity)
                            }
                            onKeyDown={handleInputNumber}
                            value={item.quantity} />
                        </td>
                        <td className="align-middle">
                          <DatePicker
                            showIcon
                            toggleCalendarOnIconClick
                            icon={
                              <div className="d-flex bg-transparent align-items-center">
                                <RiCalendarLine />
                              </div>
                            }
                            customInput={<button type="button" className="bg-white rounded">{moment(item.returnDate).format("DD-MM-yyyy")}</button>}
                            dateFormat="dd-MM-yyyy"
                            selected={item.returnDate}
                            placeholderText="Chọn ngày trả"
                            locale="vi"
                            minDate={new Date()}
                            onChange={(date) => handleInputChange(item.bookId, item.code, "returnDate", date, null)}
                          />
                        </td>
                        <td className='align-middle'>
                          <button type="button"
                            onClick={() => handleDelete(item.bookId, item.code)}
                            className="btn-icon text-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Delete">
                            <div className="icon">
                              <RiDeleteBin5Line />
                            </div>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8}>
                        <p className="text-center mb-0">No data</p>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="btn-group d-flex justify-content-end gap-3">
        <button disabled={disabled} type="submit" className="btn-fill px-3 py-2 rounded">Save</button>
        <button className="btn-border px-3 py-2 rounded">Cancel</button>
      </div>
    </form>
  )
}

export default BorrowCreate