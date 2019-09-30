import * as React from 'react';
import {IntlProvider} from 'react-intl';
import {connect} from 'react-redux';

import {ReduxState} from '../store';

type Props = {
  locale: string;
  messages: any;
} & ReturnType<typeof mapStateToProps>;

type State = {
  locale: string;
  messages: any;
};

const DynamicIntlContext = React.createContext<State>({
  locale: '',
  messages: {},
});

class _DynamicIntlProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {...props};
  }

  componentDidUpdate(prevProps: Props) {
    const {lang} = this.props;
    if (prevProps.lang !== lang) {
      import(`../lang/${lang}`).then((module) => {
        // Causes React warning but is necessary and works.
        this.setState({locale: lang, messages: module.default});
      });
    }
  }

  render() {
    const {children} = this.props;
    const {locale, messages} = this.state;

    return (
      <DynamicIntlContext.Provider value={this.state}>
        <IntlProvider
          key={locale}
          locale={locale}
          messages={messages}
          onError={() => {}}
        >
          {children}
        </IntlProvider>
      </DynamicIntlContext.Provider>
    );
  }
}

const mapStateToProps = ({lang}: ReduxState) => ({lang});

const DynamicIntlProvider = connect(mapStateToProps)(_DynamicIntlProvider);

export {DynamicIntlProvider, DynamicIntlContext};
