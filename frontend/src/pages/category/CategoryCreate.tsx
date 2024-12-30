import Select from "react-select";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks";
import { useEffect, useState } from "react";
import { commonCategory, createCategory } from "../../apis/actions/category.action";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { reset, resetError } from "../../apis/slices/category/category.slice";
import { selectStyleAsync } from "../../configs/select.config";
interface Category {
  name: string,
  parentId: string | null,
  description: string
}
const CategoryCreate = () => {
  const dispatch = useAppDispatch();
  const [disabled, setDisabled] = useState(false);
  const { categoryCommon, success, error, message } = useAppSelector((state) => state.category);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(commonCategory());
  }, [dispatch]);
  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(reset());
      setDisabled(true);
      setTimeout(() => {
        navigate("/categories/all")
      }, 1500);
    } else if(error) {
      toast.error(message);
      setDisabled(false);
      dispatch(resetError());
    }
  }, [dispatch, success, error, navigate, message])
  
  const { handleSubmit, control, formState: { errors } } = useForm<Category>();
  const onSubmit: SubmitHandler<Category> = (data) => {
    setDisabled(true);
    dispatch(createCategory(data));
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-create d-flex flex-column justify-content-between rounded p-2">
      <div className="d-flex flex-column">
        <div className="box-input">
          <label htmlFor="name">Name: <span className="text-danger">*</span></label>
          <input {...control.register("name", {
            required: "Name is required",
            validate: (value) =>
              value.trim() != "" || "Name is required"
          })} minLength={2} maxLength={72} type="text" placeholder="Enter category name" id="name" />
          {errors.name && <span className="input-error">{errors?.name?.message}</span>}
        </div>
        <div className="box-input">
          <label htmlFor="parent-id">Parent(optional)</label>
          <Controller
            name="parentId"
            control={control}
            render={({ field }) =>
              <Select
                ref={field.ref}
                options={categoryCommon.length > 0 ? categoryCommon.map((item) => ({
                  label: item.name,
                  value: item._id
                })) : []}
                value={categoryCommon.map((item) => ({ value: item._id, label: item.name })).find(c => c.value == field.value) ?? null}
                onChange={val => {
                  field.onChange(val?.value);
                }}
                styles={selectStyleAsync}
                isSearchable={false}
                inputId="parent-id"
                placeholder="Enter parent id"
              />
            }
          />
        </div>
        <div className="box-input">
          <label htmlFor="description">Description: <span className="text-danger">*</span></label>
          <textarea {...control.register("description", {
            required: "Description is required",
            validate: (value) =>
              value.trim() != "" || "Description is required"
          })}
            minLength={2} maxLength={500} placeholder="Enter category description" id="description" />
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

export default CategoryCreate