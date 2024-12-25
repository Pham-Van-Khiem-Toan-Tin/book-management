import { Link, useNavigate, useParams } from "react-router"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../common/loading/Loading";
import Select, { StylesConfig } from "react-select";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { editBookcase, viewBookcase } from "../../apis/actions/bookcase.action";
import { reset, resetError } from "../../apis/slices/bookcase/bookcase.slice";
import { allCommonLibrary } from "../../apis/actions/library.action";
interface Option {
    label: string;
    value: string | number | null;
}
interface Bookcase {
    _id: string,
    name: string,
    libraryId: string,
    description: string
}


const BookcaseEdit = () => {
    const [disabled, setDisabled] = useState(false);
    const dispatch = useAppDispatch();
    const { loading, error, bookcase, message, success, libraries } = useAppSelector((state) => state.bookcase);
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            dispatch(allCommonLibrary());
            dispatch(viewBookcase(id));
        }
    }, [dispatch, id])
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
        }
    }, [dispatch, success, error, navigate, message])
    const selectStyle: StylesConfig<Option, false> = {
        control: (baseStyles, state) => ({
            ...baseStyles,
            border: '1px solid #ececec',
            boxShadow: state.isFocused ? '0 0 0 1px #00b207' : 'none',
            padding: '0.6rem 1rem',
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
            padding: '0.6rem 1rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
            backgroundColor: state.isSelected ? '#00b207' : 'transparent',
            "&:hover": {
                backgroundColor: state.isSelected ? '#00b207' : '#dae5da'
            }
        })
    }
    const { handleSubmit, control, formState: { errors }, reset: resetForm } = useForm<Bookcase>();
    useEffect(() => {
        if (bookcase) {
            resetForm({
                _id: bookcase._id,
                name: bookcase.name,
                libraryId: bookcase.library?._id,
                description: bookcase.description
            })
        }
    }, [bookcase, resetForm])

    const onSubmit: SubmitHandler<Bookcase> = (data) => {
        setDisabled(true);
        dispatch(editBookcase(data));
    }
    return (
        <>
            {
                loading ? (<Loading />) :
                    (<form onSubmit={handleSubmit(onSubmit)} className="form-create d-flex flex-column justify-content-between rounded p-2">
                        <div className="d-flex flex-column">
                            <div className="box-input">
                                <input {...control.register("_id", {
                                    required: "Name is required",
                                    validate: (value) =>
                                        value.trim() != "" || "Name is required"
                                })} hidden minLength={2} disabled maxLength={72} type="text" placeholder="Enter category name" id="_id" />
                            </div>
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
                                    name="libraryId"	
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            ref={field.ref}
                                            options={libraries.length > 0 ? libraries.map((item) => ({
                                                label: item.name,
                                                value: item._id
                                            })) : []}
                                            value={libraries.map((item) => ({ value: item._id, label: item.name })).find(c => c.value == field.value) ?? null}
                                            onChange={val => {
                                                field.onChange(val?.value);
                                            }}
                                            styles={selectStyle}
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
                                    minLength={2} maxLength={500} placeholder="Enter bookcase description" id="description" />
                                {errors.description && <span className="input-error">{errors?.description?.message}</span>}
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <Link to="/bookcases/all" className="btn-border text-decoration-none py-2 px-3 rounded">Cancel</Link>
                            <button disabled={disabled} type="submit" className="btn-fill py-2 px-3 rounded">Save</button>
                        </div>
                    </form>)

            }
        </>
    )
}

export default BookcaseEdit