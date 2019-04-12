import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import App from '../src/components/App';
import reducers from '../src/reducers';
import { getInitState } from '../src/app';
import { defaultState } from '../server/routes';

Enzyme.configure({ adapter: new Adapter() });

let wrapper;

beforeAll(() => {
  const store = createStore(
    reducers,
    getInitState(defaultState),
  );

  const vdom = (
    <Provider store={store}>
      <App />
    </Provider>
  );

  wrapper = mount(vdom);
});

test('Init state render', () => {
  expect(wrapper.render()).toMatchSnapshot();
});
