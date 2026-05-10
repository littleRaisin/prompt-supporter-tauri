import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import Result from '../components/Result';
import Pagination from '../components/Pagination';
import SidePanel from '../components/SidePanel';
import DetailPanel from '../components/DetailPanel';
import { useItemActions } from '../hooks/useItemActions';
import { getFavoriteList } from '../db/repository';
import type { Translation } from '../types/Translation';
import { PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE } from '../constants/pagination';

const LIMIT_KEY = 'favorite_limit';

const Home = () => {
  const { t } = useTranslation();
  const [limit, setLimit] = useState(() => {
    const saved = localStorage.getItem(LIMIT_KEY);
    return saved ? Number(saved) : DEFAULT_PAGE_SIZE;
  });
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<Translation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const { currentItem, sideOpen, handleClick, handleEdit, closeSidePanel } = useItemActions();

  const requestIdRef = useRef(0);

  const refreshFavorites = useCallback(() => {
    setLoading(true);
    const requestId = ++requestIdRef.current;

    getFavoriteList(limit, page)
      .then((res) => {
        if (requestId !== requestIdRef.current) return;
        setFavorites(res.items);
        setTotal(res.total);
      })
      .catch((err: unknown) => {
        if (requestId !== requestIdRef.current) return;
        console.error(err);
        toast.error(String(err));
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setLoading(false);
      });
  }, [limit, page]);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1);
    localStorage.setItem(LIMIT_KEY, String(newLimit));
  };

  const maxPage = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="relative">
      <h2 className="text-xl font-bold mb-4">{t('common.Favorite List')}</h2>
      {loading ? (
        <div>Loading...</div>
      ) : favorites.length === 0 ? (
        <div>{t('common.No favorites')}</div>
      ) : (
        <div className="w-full">
          <div className="max-w-[500px]">
            <div className="flex items-center gap-8">
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
            <ul className="mt-4">
              {favorites.map((item) => (
                <li key={item.prompt_name} className="mb-2">
                  <Result item={item} handleClick={handleClick} handleEdit={handleEdit} />
                </li>
              ))}
            </ul>
          </div>
          <SidePanel open={sideOpen} onClose={closeSidePanel}>
            {currentItem && (
              <DetailPanel item={currentItem} onDataChange={refreshFavorites} />
            )}
          </SidePanel>
        </div>
      )}
    </div>
  );
};

export default Home;
