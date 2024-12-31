import "./sidebar.css";
import { RiArchive2Line, RiArchiveDrawerLine, RiArchiveStackLine, RiBookMarkedLine, RiDashboardLine, RiListCheck2, RiP2pLine, RiStickyNoteAddLine, RiUserAddLine } from "react-icons/ri";
import { GoDotFill } from "react-icons/go";
import Logo from "../../assets/images/login/Logo.png";
import { useEffect } from 'react';
import { Collapse } from 'bootstrap';
import { NavLink, useLocation } from "react-router";
interface ChildrenMenu {
    href: string;
    name: string;
    role: string;
}
const Sidebar = () => {
    const functions = JSON.parse(localStorage.getItem("fn") ?? "[]");
    const location = useLocation();
    console.log(location.pathname);

    useEffect(() => {
        const parent = document.getElementById("sidebar-accordion") as HTMLElement;
        const collapseElementList = document.querySelectorAll('.accordion-collapse.collapse.accordion-sidebar');
        collapseElementList.forEach(collapseEl => new Collapse(collapseEl, { parent: parent, toggle: false }));
    }, [])
    const sidebars = [
        {
            name: "Thống kê",
            icon: <RiDashboardLine />,
            role: "ADMIN",
            path: "/dashboard",
            children: [
                {
                    href: "/",
                    name: "Tổng quan",
                    role: "ADMIN"
                },
                {
                    href: "/",
                    name: "Thống kê danh mục",
                    role: "ADMIN"
                },
                {
                    href: "/",
                    name: "Thống kê sách",
                    role: "ADMIN"
                },
                {
                    href: "/",
                    name: "Thống kê khách hàng",
                    role: "ADMIN"
                }
            ]
        },
        {
            name: "Quản lí người dùng",
            icon: <RiUserAddLine />,
            role: "USER",
            path: "/users",
            children: [
                {
                    href: "/users/all",
                    name: "Danh sách người dùng",
                    role: "LIST_USER"
                }
            ]
        },
        {
            name: "Quản lí phân quyền",
            icon: <RiP2pLine />,
            role: "ROLE",
            path: "/authorities",
            children: [
                {
                    href: "/authorities/all",
                    name: "Danh sách nhóm quyền",
                    role: "LIST_ROLE"
                },
                {
                    href: "/functions/all",
                    name: "Functions List",
                    role: "ADMIN"
                },
                {
                    href: "/subfunctions/all",
                    name: "SubFunctions List",
                    role: "ADMIN"
                }
            ]
        },
        {
            name: "Quản lí cơ sở",
            icon: <RiArchiveStackLine />,
            role: "LIBRARY",
            path: "/libraries",
            children: [
                {
                    href: "/libraries/all",
                    name: "Danh sách cơ sở",
                    role: "LIST_LIBRARY"
                }
            ]
        },
        {
            name: "Quản lí danh mục",
            icon: <RiListCheck2 />,
            role: "CATEGORY",
            path: "/categories",
            children: [
                {
                    href: "/categories/all",
                    name: "Danh sách danh mục",
                    role: "LIST_CATEGORY"
                }
            ]
        },
        {
            name: "Quản lí tủ sách",
            icon: <RiArchiveDrawerLine />,
            role: "BOOKCASE",
            path: "/bookcases",
            children: [
                {
                    href: "/bookcases/all",
                    name: "Danh sách tủ sách",
                    role: "LIST_BOOKCASE"
                }
            ]
        },
        {
            name: "Quản lí giá sách",
            icon: <RiArchive2Line />,
            role: "BOOKSHELF",
            path: "/bookshelves",
            children: [
                {
                    href: "/bookshelves/all",
                    name: "Danh sách giá sách",
                    role: "LIST_BOOKSHELF"
                }
            ]
        },
        {
            name: "Quản lí sách",
            icon: <RiBookMarkedLine />,
            role: "BOOK",
            path: "/books",
            children: [
                {
                    href: "/books/all",
                    name: "Danh sách sách",
                    role: "LIST_BOOK"
                }
            ]
        },
        {
            name: "Quản lí mượn sách",
            icon: <RiStickyNoteAddLine />,
            role: "BORROW",
            path: "/borrows",
            children: [
                {
                    href: "/borrows/all",
                    name: "Danh sách mượn",
                    role: "LIST_BORROW"
                }
            ]
        }
    ];
    const filterSidebar = sidebars.filter(sidebar => functions.some((fn: string) => sidebar.role === fn));

    const getNavLinkClass = (isActive: boolean, isPending: boolean) => {
        let className = "btn-icon";
        if (isPending) {
            return className;
        }
        if (isActive) {
            className = "active " + className;
        }
        return className;
    }
    return (
        <div className="sidebar">
            <div className="top py-2 px-4">
                <div className="logo">
                    <div className="logo-content d-flex">
                        <img src={Logo} alt="Logo" />
                        <span>Thư Viện Tuổi Trẻ</span>
                    </div>
                </div>
            </div>
            <div className="middle py-4 px-4">
                <div className="accordion accordion-flush" id="sidebar-accordion">
                    {filterSidebar.map((sidebar, index) => (
                        <div className="accordion-item" key={sidebar.name}>
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse-${index}`}
                                    data-active={(location.pathname).includes(sidebar.path) ? "true" : "false"}
                                    aria-expanded="true"
                                    aria-controls={`collapse-${index}`}
                                >
                                    <div className="icon">{sidebar.icon}</div>
                                    <span>{sidebar.name}</span>
                                </button>
                            </h2>
                            <div
                                id={`collapse-${index}`}
                                className={`accordion-collapse collapse accordion-sidebar`}
                                data-bs-parent="#sidebar-accordion"
                            >
                                <div className="accordion-body">
                                    {sidebar.children
                                        .filter((child) => functions.includes(child.role))
                                        .map((child) => (
                                            <NavLink to={child.href} className={({ isActive, isPending }) => getNavLinkClass(isActive, isPending)} key={child.name}>
                                                <div className="icon">
                                                    <GoDotFill />
                                                </div>
                                                <span>{child.name}</span>
                                            </NavLink>
                                        ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bottom p-4">

            </div>
        </div>
    )
}

export default Sidebar