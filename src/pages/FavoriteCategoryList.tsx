import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Result from '../components/Result';
import Pagination from '../components/Pagination';
import SidePanel from '../components/SidePanel';
import DetailPanel from '../components/DetailPanel';
import { useItemActions } from '../hooks/useItemActions';
import { getFavoriteListByCategory } from '../db/repository';
import type { Category, Translation } from '../types/Translation';

const VALID_CATEGORIES: Category[] = ['character', 'tag', 'copyright'];
const isCategory = (v: string): v is Category =>
  VALID_CATEGORIES.includes(v as Category);

const LIMIT_KEY = 'favorite_category_limit';

const FavoriteCategoryList = () => {
  const { t } = useTranslation();
  const { category: categoryParam } = useParams<{ category: string }>();
  const category: Category | undefined =
    categoryParam && isCategory(categoryParam) ? categoryParam : undefined;

  const [limit, setLimit] = useState(() => {
    const saved = localStorage.getItem(LIMIT_KEY);
    return saved ? Number(saved) : 20;
  });
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<Translation[]>([]);
  const [total, setTotal] = useState(0);

  const { currentItem, sideOpen, handleClick, handleEdit, closeSidePanel } = useItemActions();

  const refreshFavorites = useCallback(() => {
    if (!category) return;
    getFavoriteListByCategory(limit, page, category)
      .then((res) => {
        setFavorites(res.items);
        setTotal(res.total);
      })
      .catch(console.error);
  }, [limit, page, category]);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  useEffect(() => {
    setPage(1);
  }, [category]);

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    setPage(1);
    localStorage.setItem(LIMIT_KEY, String(newLimit));
  };

  const maxPage = Math.max(1, Math.ceil(total / limit));

  const categoryLabels: Record<Category, string> = {
    character: t('common.Character'),
    copyright: t('common.Copyrights'),
    tag: t('common.Tag'),
  };

  return (
    <div className="relative">
      <h2 className="text-xl font-bold mb-4">
        {t('common.Favorite List')}: {category ? categoryLabels[category] : ''}
      </h2>
      {favorites.length === 0 ? (
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
                {[5, 10, 20, 50, 100].map((value) => (
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

export default FavoriteCategoryList;
