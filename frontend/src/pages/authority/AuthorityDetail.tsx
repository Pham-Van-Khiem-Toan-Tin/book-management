import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxhooks';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { viewAuthority } from '../../apis/actions/authorities.action';
import { toast } from 'react-toastify';
import { resetError } from '../../apis/slices/authority/authority.slice';
import './authority.css'
import Loading from '../../common/loading/Loading';
const AuthorityDetail = () => {
  const dispatch = useAppDispatch();
  const { loading, error, authority, message } = useAppSelector((state) => state.authority);
  const { id } = useParams();
  useEffect(() => {
    if (id)
      dispatch(viewAuthority(id));
  }, [dispatch, id]);
  useEffect(() => {
    if (error) {
      toast.error(message);
      dispatch(resetError())
    }
  }, [dispatch, error, message])
  return (
    <>
      {loading ? (<Loading />) : (
        <div className='authority-box'>
          <Tabs>
            <div className="row m-0">
              <div className='col-3'>
                <TabList>
                  {authority?.role.map((item) => (
                    <Tab key={item._id}>{item.name}</Tab>
                  ))}

                </TabList>
              </div>
              <div className='col-9'>
                {authority?.role.map((item) => (
                  <TabPanel key={item._id} >
                    {item.subFunctions.map((subFunction) => (
                      <div key={subFunction._id} className='d-flex align-items-center mt-2'>
                        <input type="checkbox" checked={subFunction.active} disabled id={subFunction._id} />
                        <label className='ms-2' htmlFor={subFunction._id} >{subFunction.name}</label>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </div>
            </div>
          </Tabs>
        </div>
      )}
    </>
  )
}

export default AuthorityDetail