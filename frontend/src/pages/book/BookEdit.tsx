import Select from "react-select";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { subCategory } from "../../apis/actions/category.action";
import { reset, resetError } from "../../apis/slices/book.slice";
import { selectMultipleStyleAsync, selectStyleAsync } from "../../configs/select.config";
import { RiAttachment2 } from "react-icons/ri";
import { editBook, viewBook } from "../../apis/actions/book.action";
interface Book {
    _id: string;
    title: string;
    author: string;
    categories: Array<string>;
    description: string;
    publisher: string;
    image: File | {
        public_id: string;
        url: string;
    };
    type: string;
}
const BookEdit = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const [disabled, setDisabled] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const { categories: subcategories, loadingCategory, book, success, error, message } = useAppSelector((state) => state.book);
    const { handleSubmit, reset: resetForm, control, formState: { errors }, getValues } = useForm<Book>({
        defaultValues: {
            categories: []
        }
    });
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            dispatch(viewBook(id));
            dispatch(subCategory());
        }
    }, [dispatch, id]);
    useEffect(() => {
        if (book) {
            resetForm({
                _id: book._id,
                title: book.title,
                author: book.author,
                publisher: book.publisher,
                description: book.description,
                image: book.image,
                categories: book.categories.map((item) => item._id),
                type: book.type
            });
            setImagePreview(book.image.url);
        }
    }, [book, resetForm])

    useEffect(() => {
        if (success) {
            toast.success(message);
            dispatch(reset());
            setDisabled(true);
            setTimeout(() => {
                navigate("/books/all")
            }, 1500);
        } else if (error) {
            toast.error(message);
            setDisabled(false);
            dispatch(resetError());
        }
    }, [dispatch, success, error, navigate, message])


    const onSubmit: SubmitHandler<Book> = (data) => {
        setDisabled(true);
        const formData = new FormData();
        formData.append("_id", data._id);
        formData.append("title", data.title);
        formData.append("author", data.author);
        formData.append("publisher", data.publisher);
        formData.append("description", data.description);
        formData.append("categories", JSON.stringify(data.categories));
        formData.append("type", data.type);
        if (data.image instanceof File) {
            formData.append("image", data.image);
        }
        if (id) {
            dispatch(editBook({ id: id, data: formData}));
        }
    }
    const getImageName = () => {
        const file = getValues("image");
        if (file instanceof File) {
            return file.name;
        } else if (file && "url" in file) {
            return book?.title || "Chọn ảnh"; // Nếu file là object có "url"
        }
        return "Chọn ảnh";
    }
    const optionType = [
        { label: "Sách chữ", value: "novel" },
        { label: "Truyện tranh", value: "comic" },
    ]
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-create d-flex flex-column justify-content-between rounded p-2">
            <div className="d-flex flex-column">
                <div className="box-input" hidden>
                    <label htmlFor="_id">Id: <span className="text-danger">*</span></label>
                    <input {...control.register("title", {
                        required: "Vui lòng nhập id sách",
                        validate: (value) =>
                            value.trim() != "" || "Vui lòng nhập id sách"
                    })} minLength={2} maxLength={72} type="text" placeholder="Nhập id sách" id="_id" />
                    {errors._id && <span className="input-error">{errors?._id?.message}</span>}
                </div>
                <div className="box-input">
                    <label htmlFor="title">Tiêu đề: <span className="text-danger">*</span></label>
                    <input {...control.register("title", {
                        required: "Vui lòng nhập tiêu đề sách",
                        validate: (value) =>
                            value.trim() != "" || "Vui lòng nhập tiêu đề sách"
                    })} minLength={2} maxLength={72} type="text" placeholder="Nhập tiêu đề sách" id="title" />
                    {errors.title && <span className="input-error">{errors?.title?.message}</span>}
                </div>
                <div className="box-input">
                    <label htmlFor="image">Ảnh: <span className="text-danger">*</span></label>
                    <label htmlFor="image" className="label-file rounded">
                        {imagePreview && (
                            <img src={imagePreview} className="image-preview rounded" alt="image-preview" />
                        )}

                        <div className="d-flex align-items-center gap-2 btn-file">
                            <div className="icon">
                                <RiAttachment2 />
                            </div>
                            <span>{getImageName()}</span>
                        </div>

                    </label>
                    <Controller
                        name="image"
                        control={control}
                        rules={{ required: "Vui lòng chọn ảnh sách" }}
                        render={({ field }) =>
                            <input
                                type="file"
                                id="image"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const file = e.target.files[0];
                                        field.onChange(file); // Truyền file cho react-hook-form
                                        setImagePreview(URL.createObjectURL(file)); // Tạo URL xem trước
                                    } else {
                                        field.onChange(book?.image);
                                        setImagePreview(book?.image.url ?? null);
                                    }
                                }}
                                className="d-none"
                            />
                        }
                    />
                    {errors.image && <span className="input-error">{errors?.image?.message}</span>}
                </div>
                <div className="box-input">
                    <label htmlFor="category-id">Thể loại: <span className="text-danger">*</span></label>
                    <Controller
                        name="categories"
                        control={control}
                        rules={{ required: "Vui lòng chọn thể loại" }}
                        render={({ field }) =>
                            <Select
                                ref={field.ref}
                                isLoading={loadingCategory}
                                isMulti
                                options={subcategories.map((item) => ({
                                    label: item.name,
                                    value: item._id
                                }))}
                                value={
                                    subcategories.map((item) => ({
                                        label: item.name,
                                        value: item._id
                                    })).filter((item) => field.value.includes(item.value))
                                }
                                onChange={selectedOptions => {
                                    field.onChange(selectedOptions ? selectedOptions.map((opt) => opt.value) : []);
                                }}
                                styles={selectMultipleStyleAsync}
                                isSearchable={false}
                                inputId="category-id"
                                placeholder="Chọn thể loại"
                            />
                        }
                    />
                    {errors.categories && <span className="input-error">{errors?.categories?.message}</span>}
                </div>
                <div className="box-input">
                    <label htmlFor="type">Kiểu sách: <span className="text-danger">*</span></label>
                    <Controller
                        name="type"
                        control={control}
                        rules={{ required: "Vui lòng chọn kiểu sách" }}
                        render={({ field }) =>
                            <Select
                                ref={field.ref}
                                options={optionType}
                                value={optionType.find(c => c.value == field.value) ?? null}
                                onChange={val => {
                                    field.onChange(val?.value);
                                }}
                                styles={selectStyleAsync}
                                isSearchable={false}
                                inputId="type"
                                placeholder="Chọn kiểu sách"
                            />
                        }
                    />
                    {errors.type && <span className="input-error">{errors?.type?.message}</span>}
                </div>
                <div className="box-input">
                    <label htmlFor="author">Tác giả: <span className="text-danger">*</span></label>
                    <input {...control.register("author", {
                        required: "Vui lòng nhập tác giả",
                        validate: (value) =>
                            value.trim() != "" || "Vui lòng nhập tác giả",
                    })}
                        minLength={2} maxLength={500} placeholder="Nhập tác giả" id="author" />
                    {errors.author && <span className="input-error">{errors?.author?.message}</span>}
                </div>
                <div className="box-input">
                    <label htmlFor="publisher">Nhà xuất bản: <span className="text-danger">*</span></label>
                    <input {...control.register("publisher", {
                        required: "Vui lòng nhập nhà xuất bản",
                        validate: (value) =>
                            value.trim() != "" || "Vui lòng nhập nhà xuất bản",
                    })}
                        minLength={2} maxLength={500} placeholder="Nhập nhà xuất bản" id="publisher" />
                    {errors.author && <span className="input-error">{errors?.author?.message}</span>}
                </div>
                <div className="box-input">
                    <label htmlFor="description">Thông tin chi tiết: <span className="text-danger">*</span></label>
                    <textarea {...control.register("description", {
                        required: "Vui lòng nhập thông tin chi tiết sách",
                        validate: (value) =>
                            value.trim() != "" || "Vui lòng nhập thông tin chi tiết sách"
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

export default BookEdit