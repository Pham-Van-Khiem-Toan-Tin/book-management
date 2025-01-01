import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxhooks';
import { Link, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { AuthorityDetail, editAuthority, viewAuthority } from '../../apis/actions/authorities.action';
import { toast } from 'react-toastify';
import { reset, resetError } from '../../apis/slices/authority.slice';
import './authority.css'
import Loading from '../../common/loading/Loading';
import _ from "lodash";
const AuthorityEdit = () => {
    const [roleDetail, setRoleDetail] = useState<AuthorityDetail | null>(null)
    const dispatch = useAppDispatch();
    const { loading, error, authority, message, success } = useAppSelector((state) => state.authority);
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (id)
            dispatch(viewAuthority(id));
    }, [dispatch, id]);
    useEffect(() => {
        if (authority) {
            setRoleDetail(authority)
        }
    }, [authority]);
    
    useEffect(() => {
        if (success) {
            toast.success(message);
            dispatch(reset())
            setTimeout(() => {
                navigate('/authorities/all')
            }, 1500)
        }
        if (error) {
            toast.error(message);
            dispatch(resetError())
        }
    }, [dispatch, error, message, success, navigate])
    const handleChangeSubFunction = (e: React.ChangeEvent<HTMLInputElement>, functionId: string, subfunctionId: string): void => {        
        if(roleDetail) {
            const index = roleDetail.role.findIndex((role) => role._id === functionId);
            const subFunctionIndex = roleDetail.role[index].subFunctions.findIndex((subFunction) => subFunction._id === subfunctionId);
            const newRoleDetail: AuthorityDetail = _.cloneDeep(roleDetail);
            newRoleDetail.role[index].subFunctions[subFunctionIndex].active = e.target.checked;
            setRoleDetail(newRoleDetail);            
        }
    }
    const handleSubmit = (): void => {
        if(roleDetail) dispatch(editAuthority(roleDetail));
    }
    return (
        <>
            {loading ? (<Loading />) : (
                <div className='authority-box d-flex flex-column justify-content-between'>
                    <div>
                        <Tabs>
                            <div className="row m-0">
                                <div className='col-3'>
                                    <TabList>
                                        {roleDetail?.role.map((item) => (
                                            <Tab key={item._id}>{item.name}</Tab>
                                        ))}

                                    </TabList>
                                </div>
                                <div className='col-9'>
                                    {roleDetail?.role.map((item) => (
                                        <TabPanel key={item._id} >
                                            {item.subFunctions.map((subFunction) => (
                                                <div key={subFunction._id} className='d-flex align-items-center mt-2'>
                                                    <input type="checkbox" checked={subFunction.active} onChange={(e) => handleChangeSubFunction(e, item._id, subFunction._id)} id={subFunction._id} />
                                                    <label className='ms-2' htmlFor={subFunction._id} >{subFunction.name}</label>
                                                </div>
                                            ))}
                                        </TabPanel>
                                    ))}
                                </div>
                            </div>
                        </Tabs>
                    </div>
                    <div className='btn-group d-flex justify-content-end gap-3'>
                        <button className='btn-fill rounded px-3 py-2' onClick={handleSubmit}>Save</button>
                        <Link to="/authorities/all" className='btn-border rounded px-3 py-2'>Cancel</Link>
                    </div>
                </div>
            )}
        </>
    )
}

export default AuthorityEdit