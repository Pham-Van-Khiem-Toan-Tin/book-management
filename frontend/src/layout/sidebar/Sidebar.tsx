import "./sidebar.css";
import { RiArchive2Line, RiArchiveDrawerLine, RiArchiveStackLine, RiBookMarkedLine, RiDashboardLine, RiListCheck2, RiP2pLine, RiUserAddLine } from "react-icons/ri";
import { GoDotFill } from "react-icons/go";
import Logo from "../../assets/images/login/Logo.png";
import { useEffect } from 'react';
import { Collapse } from 'bootstrap';
import { Link, NavLink } from "react-router";
const Sidebar = () => {
    useEffect(() => {
        const parent = document.getElementById("sidebar-accordion") as HTMLElement;
        const collapseElementList = document.querySelectorAll('.accordion-collapse.collapse');
        collapseElementList.forEach(collapseEl => new Collapse(collapseEl, {parent: parent, toggle: false}));
      }, [])
    return (
        <div className="sidebar">
            <div className="top py-2 px-4">
                <div className="logo">
                    <div className="logo-content d-flex">
                        <img src={Logo} alt="Logo" />
                        <span>Ecobazar</span>
                    </div>
                </div>
            </div>
            <div className="middle py-4 px-4">
                <div className="accordion accordion-flush" id="sidebar-accordion">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#dashboard" aria-expanded="true" aria-controls="dashboard">
                                <div className="icon">
                                    <RiDashboardLine />
                                </div>
                                <span>Dashboard</span>
                            </button>
                        </h2>
                        <div id="dashboard" className="accordion-collapse collapse show" data-bs-parent="#sidebar-accordion">
                            <div className="accordion-body">
                                <div className="btn-icon">
                                    <div className="icon">
                                        <GoDotFill />
                                    </div>
                                    <span>Overview</span>
                                </div>
                                <div className="btn-icon">
                                    <div className="icon">
                                        <GoDotFill />
                                    </div>
                                    <span>Statistics By Category</span>
                                </div>
                                <div className="btn-icon">
                                    <div className="icon">
                                        <GoDotFill />
                                    </div>
                                    <span>Statistics By Product</span>
                                </div>
                                <div className="btn-icon">
                                    <div className="icon">
                                        <GoDotFill />
                                    </div>
                                    <span>Statistics By Customer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#users" aria-expanded="false" aria-controls="users">
                                <div className="icon">
                                    <RiUserAddLine />
                                </div>
                                <span>User Management</span>
                            </button>
                        </h2>
                        <div id="users" className="accordion-collapse collapse" data-bs-parent="#sidebar-accordion">
                            <div className="accordion-body">
                                <Link to="/users/all" className="btn-icon">
                                    <div className="icon">
                                        <GoDotFill />
                                    </div>
                                    <span>User List</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#roles" aria-expanded="false" aria-controls="users">
                                <div className="icon">
                                    <RiP2pLine />
                                </div>
                                <span>Authority Management</span>
                            </button>
                        </h2>
                        <div id="roles" className="accordion-collapse collapse" data-bs-parent="#sidebar-accordion">
                            <div className="accordion-body">
                                <Link to="/authorities/all" className="btn-icon">
                                    <div className="icon">
                                        <GoDotFill />
                                    </div>
                                    <span>Authorities List</span>
                                </Link>
                                <Link to="/functions/all" className="btn-icon">
                                    <div className="icon">
                                        <GoDotFill />
                                    </div>
                                    <span>Functions List</span>
                                </Link>
                                <Link to="/subfunctions/all" className="btn-icon">
                                    <div className="icon">
                                        <GoDotFill />
                                    </div>
                                    <span>SubFunctions List</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#products" aria-expanded="false" aria-controls="products">
                                <div className="icon">
                                    <RiArchiveStackLine />
                                </div>
                                <span>Library Management</span>
                            </button>
                        </h2>
                        <div id="products" className="accordion-collapse collapse" data-bs-parent="#sidebar-accordion">
                            <div className="accordion-body">
                                <Link to="/libraries/all" className="btn-icon">
                                    <div className="icon">
                                        <GoDotFill />
                                    </div>
                                    <span>Library List</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#categories" aria-expanded="false" aria-controls="categories">
                                <div className="icon">
                                    <RiListCheck2 />
                                </div>
                                <span>Category Management</span>
                            </button>
                        </h2>
                        <div id="categories" className="accordion-collapse collapse" data-bs-parent="#sidebar-accordion">
                            <div className="accordion-body">
                                <NavLink to="/categories/all" className="btn-icon">
                                    <div className="icon">
                                        <GoDotFill />
                                    </div>
                                    <span>Category List</span>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#orders" aria-expanded="false" aria-controls="orders">
                                <div className="icon">
                                    <RiArchiveDrawerLine />
                                </div>
                                <span>Bookcase Management</span>
                            </button>
                        </h2>
                        <div id="orders" className="accordion-collapse collapse" data-bs-parent="#sidebar-accordion">
                            <div className="accordion-body">
                                <Link to="/bookcases/all" className="btn-icon">
                                    <div className="icon">
                                        <GoDotFill />
                                    </div>
                                    <span>Bookcase List</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#coupon" aria-expanded="false" aria-controls="coupon">
                                <div className="icon">
                                    <RiArchive2Line />
                                </div>
                                <span>Shelf Management</span>
                            </button>
                        </h2>
                        <div id="coupon" className="accordion-collapse collapse" data-bs-parent="#sidebar-accordion">
                            <div className="accordion-body">
                                <Link to="/bookshelves/all" className="btn-icon">
                                    <div className="icon">
                                        <GoDotFill />
                                    </div>
                                    <span>Shelf List</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#review" aria-expanded="false" aria-controls="review">
                                <div className="icon">
                                    <RiBookMarkedLine />
                                </div>
                                <span>Book Management</span>
                            </button>
                        </h2>
                        <div id="review" className="accordion-collapse collapse" data-bs-parent="#sidebar-accordion">
                            <div className="accordion-body">
                                <Link to="/books/all" className="btn-icon">
                                    <div className="icon">
                                        <GoDotFill />
                                    </div>
                                    <span>Book List</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bottom p-4">

            </div>
        </div>
    )
}

export default Sidebar