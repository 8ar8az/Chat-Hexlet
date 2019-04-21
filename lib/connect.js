import { connect } from 'react-redux';
import * as actions from '../src/actions';

export default mapStateToProps => Component => connect(mapStateToProps, actions)(Component);
