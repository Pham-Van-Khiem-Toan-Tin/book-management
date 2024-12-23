import "./modal.css";
interface ModalBsProps {
    children: React.ReactNode; // Định nghĩa kiểu cho children là ReactNode
    maxWidth: string
}
const ModalBs: React.FC<ModalBsProps> = ({children, maxWidth}) => {
    return (
        <div className="modal fade" id="modal-bookshop" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" style={{maxWidth: maxWidth}}>
                <div className="modal-content">
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalBs