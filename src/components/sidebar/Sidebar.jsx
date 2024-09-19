import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.scss';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Menu</h2>
            <ul>
                {/* <li>
                    <Link to="/data-validation/amazon">Data Validation</Link>
                </li> */}
                {/* <li>
                    <Link to="/campaign-validation/amazon">Campaign Validation</Link>
                </li> */}
                <li>
                    <Link to="/data-campaign-validation/amazon">Data+Campaign Validation</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;