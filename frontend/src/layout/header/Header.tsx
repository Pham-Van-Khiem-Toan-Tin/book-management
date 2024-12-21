import { ControlledMenu, Menu, MenuItem, useHover, useMenuState } from '@szhsin/react-menu';
import { BsChevronDown } from "react-icons/bs";
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import { useRef } from "react";
import AvatarDefault from "../../assets/images/user/avatar.png";
import "./header.css"
import { RiLogoutBoxLine, RiMailLine, RiNotification2Line, RiUserSettingsLine } from "react-icons/ri";
import { useAppSelector } from '../../hooks/reduxhooks';
const Header = () => {
  const { loading, name, avatar } = useAppSelector((state) => state.auth);
  const ref = useRef(null);
  const [menuState, toggle] = useMenuState({ transition: true });
  const { anchorProps, hoverProps } = useHover(menuState.state, toggle);
  const login = () => {
    // auth.signIn()
    // Xử lý response và token sau khi đăng nhập thành công
  };
  return (
    <div className='py-2 px-4 header-management'>
      <div className="header-container d-flex align-items-center justify-content-between">

        <button type="button" onClick={login} className="btn btn-secondary">
          Custom tooltip
        </button>
        <div className="btn-group">
          <Menu menuButton={
            <button className="btn-icon rounded-circle">
              <div className="icon">
                <RiMailLine />
              </div>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                9+
              </span>
            </button>
          }
          >
            <MenuItem>
              <div className="d-flex align-items-center gap-2">
                <div className="icon"><RiUserSettingsLine /></div>
                <span>Account Setting</span>
              </div></MenuItem>
            <MenuItem>
              <div className="d-flex align-items-center gap-2">
                <div className="icon"><RiLogoutBoxLine /></div>
                <span>Logout</span>
              </div>
            </MenuItem>
          </Menu>
          <Menu menuButton={
            <button type="button" className="btn-icon rounded-circle">
              <div className="icon">
                <RiNotification2Line />
              </div>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                9+
              </span>
            </button>
          }>
            <div className="notification-dropdown p-2">test</div>

          </Menu>
          <button ref={ref} {...anchorProps} className={`btn-icon rounded-pill btn-dropdown ${menuState.state == "open" ? "btn-icon-rotate" : ""}`}>
            <div className="avatar">
              {loading ? 
                <div className='placeholder avatar-img'></div> :
                <img className='avatar-img' loading='lazy' src={avatar ?? AvatarDefault} alt="" />
              }
            </div>
            <div className="icon">
              <BsChevronDown />
            </div>
          </button>
          <ControlledMenu
            {...hoverProps}
            {...menuState}
            anchorRef={ref}
            onClose={() => toggle(false)}
          >
            <MenuItem>
              <div className="d-flex align-items-center gap-2">
                <div className="icon"><RiUserSettingsLine /></div>
                <span>Account Setting</span>
              </div></MenuItem>
            <MenuItem>
              <div className="d-flex align-items-center gap-2">
                <div className="icon"><RiLogoutBoxLine /></div>
                <span>Logout</span>
              </div></MenuItem>
          </ControlledMenu>
        </div>
      </div>
    </div>
  )
}

export default Header