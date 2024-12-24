import { Link, useParams } from "react-router"
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxhooks"
import { useEffect } from "react";
import { categoryDetail } from "../../../apis/actions/category.action";
import moment from "moment";
import { toast } from "react-toastify";
import { resetError } from "../../../apis/slices/category/category.slice";
import Loading from "../../../common/loading/Loading";
import "./category-detail.css";
const CategoryDetail = () => {
    const dispatch = useAppDispatch();
    const { loading, error, category, message } = useAppSelector((state) => state.category);
    const { id } = useParams();
    useEffect(() => {
        if (id)
            dispatch(categoryDetail(id));
    }, [dispatch, id])
    useEffect(() => {
        if (error) {
            toast.error(message);
            dispatch(resetError())
        }
    }, [dispatch, error, message])

    return (
        <>
            {
                loading ? (<Loading />) :
                    (<div className="category-create d-flex flex-column justify-content-between rounded p-2">
                        <div className="d-flex flex-column">
                            <div className="box-input">
                                <label htmlFor="name">Name: <span className="text-danger">*</span></label>
                                <span className="span-input">{category?.name}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="parent-id">Parent:</label>
                                <span className="span-input">{category?.parent_id?.name ?? "No data"}</span>
                            </div>
                            <div className="box-input">
                                <label htmlFor="description">Description: <span className="text-danger">*</span></label>
                                <span className="span-area">{moment(category?.createdAt).format("HH:mm:ss DD-MM-YYYY")}</span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <Link to="/categories/all" className="btn-border text-decoration-none py-2 px-3 rounded">Return</Link>
                        </div>
                    </div>)

            }
        </>
    )
}

export default CategoryDetail