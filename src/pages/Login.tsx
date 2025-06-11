import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import type { LoginRequest } from '../types/auth';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const { login, isPending, error } = useAuth();

  const onSubmit = async (data: LoginRequest) => {
    await login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white p-8 rounded-lg shadow space-y-6"
        noValidate
      >
        <h2 className="text-3xl font-semibold text-center text-blue-600">{t('login')}</h2>

        {error && <p className="text-red-600 text-center text-sm">{error}</p>}

        <Input
          label={t('username')}
          type="username"
          placeholder={t('username')}
          {...register('username', { required: t('username') + ' ' + t('isRequired') + '.' })}
          error={errors.username?.message}
        />

        <Input
          label={t('password')}
          type="password"
          placeholder={t('password')}
          {...register('password', { required: t('password') + ' ' + t('isRequired') + '.' })}
          error={errors.password?.message}
        />

        <Button className='w-full' type="submit" isLoading={isPending}>
          {t('login')}
        </Button>
      </form>
    </div>
  );
};

export default Login;
