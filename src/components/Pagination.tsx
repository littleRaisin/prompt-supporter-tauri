import { useTranslation } from 'react-i18next';

type PaginationProps = {
  page: number;
  maxPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ page, maxPage, onPageChange }: PaginationProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2 items-center">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        {t('common.Previous')}
      </button>
      <span>
        {t('common.Page')} {page} / {maxPage}
      </span>
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(Math.min(maxPage, page + 1))}
        disabled={page >= maxPage}
      >
        {t('common.Next')}
      </button>
    </div>
  );
};

export default Pagination;
