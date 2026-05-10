import { useCallback, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Result from '../components/Result';
import SidePanel from '../components/SidePanel';
import DetailPanel from '../components/DetailPanel';
import Pagination from '../components/Pagination';
import { useItemActions } from '../hooks/useItemActions';
import { searchTranslations } from '../db/repository';
import type { Translation } from '../types/Translation';
import { PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE } from '../constants/pagination';

const LIMIT_KEY = 'search_result_limit';

const SearchResult = () => {
  const { t } = useTranslation();
  const { promptName } = useParams<{ promptName: string }>();
  const location = useLocation();
  const [result, setResult] = useState<Translation[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(() => {
    const saved = localStorage.getItem(LIMIT_KEY);
    return saved ? Number(saved) : DEFAULT_PAGE_SIZE;
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const { currentItem, sideOpen, handleClick, handleEdit, closeSidePanel } = useItemActions();

  const refreshSearchResults = useCallback(() => {
    if (!promptName) return;
    setLoading(true);

    const params = new URLSearchParams(location.search);
    const categories = {
      character: params.get('character') === 'true',
      tag: params.get('tag') === 'true',
      copyright: params.get('copyright') === 'true',
    };

    let cancelled = false;

    searchTranslations({ keyword: promptName, categories, limit, page })
      .then((res) => {
        if (cancelled) return;
        setResult(res.items);
        setTotal(res.total);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setResult(null);
        setTotal(0);
        toast.error(String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [promptName, location.search, limit, page]);

  useEffect(() => {
    const cancel = refreshSearchResults();
    return cancel;
  }, [refreshSearchResults]);

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1);
    localStorage.setItem(LIMIT_KEY, String(newLimit));
  };

  const maxPage = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {t('common.SearchWord')}:
        <span className="inline-block ml-2">{promptName}</span>
      </h2>
      {!loading && (!result || result.length === 0) ? (
        <div>{t('common.No data registered')}</div>
      ) : (
        <div className="w-full max-w-full">
          <div className="max-w-[500px]">
            <div className="flex items-center gap-8 mb-4">
              <Pagination page={page} maxPage={maxPage} onPageChange={setPage} />
              <select
                value={limit}
                onChange={handleLimitChange}
                className="border rounded px-2 py-1"
              >
                {PAGE_SIZE_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {t('common.itemsPerPage', { count: value })}
                  </option>
                ))}
              </select>
            </div>
            <ul>
              {result?.map((item) => (
                <li key={item.prompt_name} className="mb-2">
                  <Result item={item} handleClick={handleClick} handleEdit={handleEdit} />
                </li>
              ))}
            </ul>
          </div>
          <SidePanel open={sideOpen} onClose={closeSidePanel}>
            {currentItem && (
              <DetailPanel item={currentItem} onDataChange={refreshSearchResults} />
            )}
          </SidePanel>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
