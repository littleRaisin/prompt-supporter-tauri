import { useTranslation } from 'react-i18next';

type FavoriteIconProps = {
  isFavorite: boolean;
  onClick?: () => void;
};

const FavoriteIcon = ({ isFavorite, onClick }: FavoriteIconProps) => {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-block cursor-pointer text-xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
      title={isFavorite ? t('common.Remove from favorites') : t('common.Add to favorites')}
      onClick={onClick}
    >
      {isFavorite ? '★' : '☆'}
    </span>
  );
};

export default FavoriteIcon;
