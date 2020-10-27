import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { Link, useModel } from 'umi';
import { getPageQuery } from '@/utils/utils';
import logo from '@/assets/logo.svg';
import { LoginParamsType, loginByPassword, getPasswordHash, setLockPassword } from '@/services/login';
import Footer from '@/components/Footer';
import LoginFrom from './components/Login';
import styles from './style.less';

const { Tab, Password, Submit } = LoginFrom;

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#'));
      }
    } else {
      window.location.href = '/';
      return;
    }
  }
  window.location.href = urlParams.href.split(urlParams.pathname)[0] + (redirect || '/');
};

const Login: React.FC<{}> = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({ status: 200 });
  const [submitting, setSubmitting] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const { refresh, setInitialState } = useModel('@@initialState');
  const [type, setType] = useState<string>('account');
  const handleSetPassword = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // set your lock password
      const password = values.password
      const result = await setLockPassword(password);
      if (result.status === 200) {
        setInitialState({ currentUser: { password: password } });
        message.success('Set your lock password successfully!');
        replaceGoto();
        setTimeout(() => {
          refresh();
        }, 0);
        return;
      }
    } catch (error) {
      message.error('Set your lock password error, please try it again');
    }
    setSubmitting(false);
  }

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // unlock by password
      const password = values.password;
      const result = await loginByPassword(password);
      if (result.status === 200) {
        setInitialState({ currentUser: { password: password } });
        message.success('Unlock Successfully！');
        replaceGoto();
        setTimeout(() => {
          refresh();
        }, 0);
        return;
      }
      setUserLoginState(result);
    } catch (error) {
      message.error('Unlock your account error! Please try it again');
    }
    setSubmitting(false);
  };

  // store temp password
  const onPasswordChange = (e: { target: { value: any; }; }) => {
    const { value } = e.target;
    setPasswordValue(value);
  }

  // validate password
  const checkPassword = (_: any, value: string, callback: any) => {
    if (value && value !== passwordValue) {
      callback("Input passwords are inconsistent!");
    } else {
      callback();
    }
  }

  const { status } = userLoginState;

  // if the user is the first time to login
  let passwordHash = getPasswordHash();
  if (passwordHash) {
    return (
      <div className={styles.container}>
        {/* <div className={styles.lang}>
        <SelectLang />
      </div> */}
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Stacks Mining Bot</span>
              </Link>
            </div>
            <div className={styles.desc}>Stacks Mining Bot is an interesting tool!</div>
          </div>

          <div className={styles.main}>
            <LoginFrom activeKey={type} onSubmit={handleSubmit}>
              <Tab key="account" tab="Unlock Your Account">
                {status !== 200 && !submitting && (
                  <LoginMessage content="password error" />
                )}

                <Password
                  name="password"
                  onChange={onPasswordChange}
                  rules={[
                    {
                      required: true,
                      message: 'please input your password!',
                    },
                    {
                      min: 8,
                      message: 'password should be at least 8 characters! ',
                    },
                  ]}
                />
              </Tab>
              <Submit loading={submitting}>Unlock</Submit>
            </LoginFrom>
          </div>
        </div>
        <Footer />
      </div>
    );
  } else { // else just redirect to the unlock page
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Stacks Mining Bot</span>
              </Link>
            </div>
            <div className={styles.desc}>Stacks Mining Bot is an interesting tool!</div>
          </div>

          <div className={styles.main}>
            <LoginFrom activeKey={type} onSubmit={handleSetPassword}>
              <Tab key="account" tab="Set Your Lock Password">

                <Password
                  name="password1"
                  placeholder="type your password"
                  onChange={onPasswordChange}
                  rules={[
                    {
                      required: true,
                      message: 'please input your password!',
                    },
                    {
                      min: 8,
                      message: 'password should be at least 8 characters! ',
                    },
                  ]}
                />

                <Password
                  name="password2"
                  placeholder="type your password again"
                  rules={[
                    {
                      required: true,
                      message: 'please input your password again!',
                    },
                    {
                      validator: checkPassword,
                    }
                  ]}
                />
              </Tab>
              <Submit loading={submitting}>Login</Submit>
            </LoginFrom>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
};

export default Login;