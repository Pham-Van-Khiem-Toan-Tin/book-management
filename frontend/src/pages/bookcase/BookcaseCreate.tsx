import Select from "react-select";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { createBookcase } from "../../apis/actions/bookcase.action";
import { reset, resetError } from "../../apis/slices/bookcase/bookcase.slice";
import { allCommonLibrary } from "../../apis/actions/library.action";
import { selectStyleAsync } from "../../configs/select.config";
import { resetError as resetErrorLb } from "../../apis/slices/library/library.slice";
interface Bookcase {
  id: string,
  name: string,
  libraryId: string,
  description: string,
}
const BookcaseCreate = () => {
  const dispatch = useAppDispatch();
  const [disabled, setDisabled] = useState(false);
  const { success, error, message } = useAppSelector((state) => state.bookcase);
  const { loading: loadingLibrary, error: errorLibrary, message: messageLibrary, librariesSelect } = useAppSelector((state) => state.library);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(allCommonLibrary());
  }, [dispatch]);
  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(reset());
      setDisabled(true);
      setTimeout(() => {
        navigate("/bookcases/all")
      }, 1500);
    } else if (error) {
      toast.error(message);
      setDisabled(false);
      dispatch(resetError());
    } else if (errorLibrary) {
      toast.error(messageLibrary);
      setDisabled(false);
      dispatch(resetErrorLb());
    }
  }, [dispatch, success, error, navigate, message, errorLibrary, messageLibrary])


  const { handleSubmit, control, formState: { errors } } = useForm<Bookcase>();
  const onSubmit: SubmitHandler<Bookcase> = (data) => {
    setDisabled(true);
    dispatch(createBookcase(data));
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-create d-flex flex-column justify-content-between rounded p-2">
      <div className="d-flex flex-column">
        <div className="box-input">
          <label htmlFor="id">Mã tủ sách: <span className="text-danger">*</span></label>
          <input {...control.register("id", {
            required: "Vui lòng nhập mã tủ sách",
            validate: (value) =>
              value.trim() != "" || "Vui lòng nhập mã tủ sách"
          })} minLength={2} maxLength={72} onKeyDown={handleKeyDown} type="text" placeholder="Nhập mã tủ sách" id="id" />
          {errors.name && <span className="input-error">{errors?.name?.message}</span>}
        </div>
        <div className="box-input">
          <label htmlFor="name">Tên tử sách: <span className="text-danger">*</span></label>
          <input {...control.register("name", {
            required: "Vui lòng nhập tên tủ sách",
            validate: (value) =>
              value.trim() != "" || "Vui lòng nhập tên tủ sách"
          })} minLength={2} maxLength={72} type="text" placeholder="Nhập tên tủ sách" id="name" />
          {errors.name && <span className="input-error">{errors?.name?.message}</span>}
        </div>
        <div className="box-input">
          <label htmlFor="library-id">Thư viện: <span className="text-danger">*</span></label>
          <Controller
            name="libraryId"
            control={control}
            rules={{
              required: "Vui lòng chọn thư viện",
            }}
            render={({ field }) =>
              <Select
                ref={field.ref}
                isLoading={loadingLibrary}
                options={librariesSelect.length > 0 ? librariesSelect.map((item) => ({
                  label: item.name,
                  value: item._id
                })) : []}
                value={librariesSelect.map((item) => ({ value: item._id, label: item.name })).find(c => c.value == field.value) ?? null}
                onChange={val => {
                  field.onChange(val?.value);
                }}
                styles={selectStyleAsync}
                isSearchable={false}
                inputId="library-id"
                placeholder="Chọn thư viện"
              />
            }
          />
          {errors.libraryId && <span className="input-error">{errors?.libraryId?.message}</span>}
        </div>
        <div className="box-input">
          <label htmlFor="description">Thông tin chi tiết: <span className="text-danger">*</span></label>
          <textarea {...control.register("description", {
            required: "Vui lòng nhập thông tin chi tiết tủ sách",
            validate: (value) =>
              value.trim() != "" || "Vui lòng nhập thông tin chi tiết tủ sách"
          })}
            minLength={2} maxLength={500} placeholder="Nhập thông tin chi tiết" id="description" />
          {errors.description && <span className="input-error">{errors?.description?.message}</span>}
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2">
        <Link to="/categories/all" className="btn-border text-decoration-none py-2 px-3 rounded">Cancel</Link>
        <button disabled={disabled} type="submit" className="btn-fill py-2 px-3 rounded">Save</button>
      </div>
    </form>
  )
}

export default BookcaseCreate