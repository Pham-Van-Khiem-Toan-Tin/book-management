import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxhooks"
import { allCategory } from "../../../apis/actions/category.action";
import { toast } from "react-toastify";
import { resetError } from "../../../apis/slices/category/category.slice";
import Loading from "../../../common/loading/Loading";
import { Link } from "react-router";
import moment from "moment";
import { RiEdit2Line, RiInformation2Line } from "react-icons/ri";

const CategoryList = () => {
  const [keyword, setKeyword] = useState("");
  const dispatch = useAppDispatch();
  const { loading, message, categories, error } = useAppSelector((state) => state.category);
  useEffect(() => {
    dispatch(allCategory(null));
  }, [dispatch]);
  useEffect(() => {
    if (error) {
      toast.error(message);
      dispatch(resetError());
    }
  }, [dispatch, error, message]);
  const handleSearch = () => {
    const key = keyword.trim();
    if(key)
      dispatch(allCategory(keyword.trim()))
  }
  return (
    <>
      {loading ?
        <Loading /> :
        <div>
          <div className="box-search mb-3">
            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search by name" />
            <button onClick={handleSearch} className="btn-fill rounded">Search</button>
          </div>
          <div className="box-handle mb-3">
            <Link to="/categories/create" className="btn-fill rounded">Create</Link>
            <button className="btn-fill rounded">Export</button>
          </div>
          <div className="rounded border table-responsive">
            <table className="table table-striped table-borderless mb-0 table-sm">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Parent</th>
                  <th scope="col">Created at</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories && categories.length > 0 ? (
                  categories.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.parent_id?.name ?? "No data"}</td>
                      <td>{moment(item?.createdAt).format("DD-MM-YYYY")}</td>
                      <td>
                        <Link className="btn-icon" to={`/categories/edit/${item._id}`}>
                          <div className="icon">
                            <RiEdit2Line />
                          </div>
                        </Link>
                        <Link className="btn-icon" to={`/categories/view/${item._id}`}>
                          <div className="icon">
                            <RiInformation2Line />
                          </div>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>
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