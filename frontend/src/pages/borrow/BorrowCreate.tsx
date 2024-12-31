import Select from "react-select"
import { createSelectStyles } from "../../configs/select.config"
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks";
import { useDebounceCallback } from "usehooks-ts";
import { allReader } from "../../apis/actions/user.action";
import { KeyboardEvent, useState } from "react";
import { allBookOfLibrary } from "../../apis/actions/book.action";
import { RiDeleteBin5Line } from "react-icons/ri";

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
  };
  label: string;
}
interface BorrowCreate {
  userId: string;
  email: string;
  phone: string;
}
interface BookOfBorrow {
  bookId: string;
  quantity: number;
  code: string;
  title: string;
  image: string;
  bookshelf: string;
}
const BorrowCreate = () => {
  const [bookKeyword, setBookKeyword] = useState<string | null>(null);
  const [bookList, setBookList] = useState<Array<BookOfBorrow>>([]);
  const [selectedValue, setSelectedValue] = useState<OptionBookObject | null>(null);

  const selectOptionsString = createSelectStyles<OptionObject>();
  const selectOptionsBook = createSelectStyles<OptionBookObject>();
  const { handleSubmit, setValue, control, formState: { errors } } = useForm<BorrowCreate>();
  const { loading: loadingReader, readers } = useAppSelector((state) => state.user);
  const { loading: loadingBook, bookOfLibrary } = useAppSelector((state) => state.book);
  const { library } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const handleSearchReader = useDebounceCallback((val: string) => {
    dispatch(allReader(val));
  }, 500);
  const handleSearchBook = useDebounceCallback((val: string) => {
    if (library) dispatch(allBookOfLibrary({
      keyword: val, libraryId: library, bookSelected: bookList.map((item) => ({
        bookId: item.bookId,
        bookshelfId: item.bookshelf
      }))
    }));
  }, 500);

  const handleKeydown = (event: KeyboardEvent<HTMLInputElement>) => {
    const key = event.key;
    const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
    if (!/^[0-9]$/.test(key) && !allowedKeys.includes(key)) {
      event.preventDefault();
    }
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
  const onSubmit: SubmitHandler<BorrowCreate> = (data) => {
    console.log(data);
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="form-create p-2 d-flex flex-column justify-content-between">
      <div>
        <div className="box-input">
          <label htmlFor="borrower">Người mượn: <span className="text-danger">*</span></label>
          <Controller
            name="userId"
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
          {errors.userId && <span className="input-error">{errors?.userId?.message}</span>}
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
              setBookKeyword(val);
            }}
            onChange={(val) => {
              if (val && library) {
                const newBookList = [...bookList, {
                  bookId: val.value._id,
                  quantity: 1,
                  code: val.value.code,
                  title: val.value.title,
                  image: val.value.image,
                  bookshelf: val.value.bookshelf
                }];
                setBookList(newBookList);
                setSelectedValue(null);
                setBookKeyword(null);
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
                bookshelf: item.bookshelfId
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
                          <input type="text" disabled value={item.title} />
                        </td>
                        <td className="align-middle">
                          <input type="text" disabled value={item.code} />
                        </td>
                        <td className="align-middle">
                          <input type="text"
                            // onChange={(e) =>
                            //   handleInputChange(item.bookId, "quantity", e.target.value)
                            // }
                            onKeyDown={handleInputNumber}
                            value={item.quantity} />
                        </td>
                        <td className='align-middle'>
                          <button
                            // onClick={() => handleDelete(item.bookId)} 
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
      <div className="btn-group d-flex justify-content-end gap-3">
        <button type="submit" className="btn-fill px-3 py-2 rounded">Save</button>
        <button type="submit" className="btn-border px-3 py-2 rounded">Cancel</button>
      </div>
    </form>
  )
}

export default BorrowCreate