import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxhooks"
import { allCategory } from "../../../apis/actions/category.action";
import { toast } from "react-toastify";
import { resetError } from "../../../apis/slices/category/category.slice";
import Loading from "../../../common/loading/Loading";
import { Link } from "react-router";

const CategoryList = () => {
  const dispatch = useAppDispatch();
  const { loading, message, categories } = useAppSelector((state) => state.category);
  useEffect(() => {
    dispatch(allCategory());
  }, [dispatch]);
  useEffect(() => {
    if (message) {
      toast.error(message);
      dispatch(resetError());
    }
  }, [dispatch, message]);

  return (
    <>
      {loading ?
        <Loading /> :
        <div>
          <div className="box-search mb-3">
            <input type="text" placeholder="Search by name" />
            <button className="btn-fill rounded">Search</button>
          </div>
          <div className="box-handle mb-3">
            <Link to="/categories/create" className="btn-fill rounded">Create</Link>
            <button className="btn-fill rounded">Export</button>
          </div>
          <div className="rounded border table-responsive">
            <table className="table table-striped table-borderless mb-0 table-sm">
              {categories && categories.length > 0 && (<caption>List of category</caption>)}
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Parent</th>
                  <th scope="col">Created at</th>
                </tr>
              </thead>
              <tbody>
                {categories && categories.length > 0 ? (
                  categories.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.parent?.name ?? "No data"}</td>
                      <td>{item.created_at.toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <p className="text-center mb-0">No data</p>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      }
    </>
  )
}

export default CategoryList