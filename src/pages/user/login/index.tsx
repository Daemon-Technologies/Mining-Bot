import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, Link, SelectLang, useModel } from 'umi';
import { getPageQuery } from '@/utils/utils';
import logo from '@/assets/logo.png';
import { LoginParamsType, loginByPassword, getUserAuth, setLockPassword } from '@/services/login';
import Footer from '@/components/Footer';
import LoginForm from './components/Login';
import styles from './style.less';
import { showMessage } from '@/services/locale';

const { Tab, Password, Submit } = LoginForm;

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
        message.success(showMessage('锁定密码成功！', 'Set your lock password successfully!'));
        replaceGoto();
        setTimeout(() => {
          refresh();
        }, 0);
        return;
      }
    } catch (error) {
      message.error(showMessage('设置锁定密码失败，请重试！', 'Set your lock password error, please try it again'));
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
        message.success(showMessage('解锁成功！', 'Unlock Successfully！'));
        replaceGoto();
        setTimeout(() => {
          refresh();
        }, 0);
        return;
      }
      setUserLoginState(result);
    } catch (error) {
      message.error(showMessage('解锁账户失败！请重试！', 'Unlock your account error! Please try it again'));
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
      callback(showMessage('两次输入密码不一致！', "Input passwords are inconsistent!"));
    } else {
      callback();
    }
  }

  const { status } = userLoginState;

  // if the user is the first time to login
  const userAuth = getUserAuth();
  if (userAuth) {
    return (
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}><FormattedMessage id='login.title' defaultMessage='Stacks Mining Bot' /></span>
              </Link>
            </div>
            <div className={styles.desc}><FormattedMessage id='login.subTitle' defaultMessage='Stacks Mining Bot is an interesting tool!' /></div>
          </div>

          <div className={styles.main}>
            <LoginForm activeKey={type} onSubmit={handleSubmit}>
              <Tab key="account" tab={<FormattedMessage id='login.unlock' defaultMessage='Unlock Your Account' />}>
                {status !== 200 && !submitting && (
                  <LoginMessage content={showMessage('密码错误!', 'password error!')} />
                )}

                <Password
                  name="password"
                  placeholder={showMessage('密码', 'password')}
                  onChange={onPasswordChange}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id='message.unlock.pwd' defaultMessage='please input your password!' />,
                    },
                    {
                      min: 8,
                      message: <FormattedMessage id='message.unlock.leastLength' defaultMessage='password should be at least 8 characters!' />,
                    },
                  ]}
                />
              </Tab>
              <Submit loading={submitting}><FormattedMessage id='button.unlock' defaultMessage='Unlock' /></Submit>
            </LoginForm>
          </div>
        </div>
        <Footer />
      </div >
    );
  } else { // else just redirect to the set lock password
    return (
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}><FormattedMessage id='login.title' defaultMessage='Stacks Mining Bot' /></span>
              </Link>
            </div>
            <div className={styles.desc}><FormattedMessage id='login.subTitle' defaultMessage='Stacks Mining Bot is an interesting tool!' /></div>
          </div>

          <div className={styles.main}>
            <LoginForm activeKey={type} onSubmit={handleSetPassword}>
              <Tab key="account" tab={<FormattedMessage id='login.setLockPwd' defaultMessage='Set Your Lock Password' />}>
                <Password
                  name="password"
                  placeholder={showMessage('输入密码', 'type your password')}
                  onChange={onPasswordChange}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id='message.unlock.pwd' defaultMessage='please input your password!' />,
                    },
                    {
                      min: 8,
                      message: <FormattedMessage id='message.unlock.leastLength' defaultMessage='password should be at least 8 characters!' />,
                    },
                  ]}
                />

                <Password
                  name="password2"
                  placeholder={showMessage('再次输入密码', 'type your password again')}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id='message.unlock.pwdAgain' defaultMessage='please input your password again!' />,
                    },
                    {
                      validator: checkPassword,
                    }
                  ]}
                />
              </Tab>
              <Submit loading={submitting}><FormattedMessage id='button.login' defaultMessage='Login' /></Submit>
            </LoginForm>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
};

export default Login;