import React from 'react';

const LogoutModal = (props) => {

    const { handleLogout } = props;

    return (
        <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">Logout</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="modal-body">Are you sure you want to logout?</div>
                <div className="modal-footer">
                    <div className="btn-group-submit">
                        <button type="button" className="button button--red" data-dismiss="modal">Cancel</button>
                        <button type="button" className="button button--gray" data-dismiss="modal" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default LogoutModal;