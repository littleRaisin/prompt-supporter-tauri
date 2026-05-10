import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import SearchCategoryCheckbox from './SearchCategoryCheckbox';
import SettingsPanel from './SettingsPanel';
import type { SearchCategories, Category } from '../types/Translation';

type FormData = { search: string };

const SEARCH_CATEGORIES_KEY = 'search_categories';

const Header = () => {
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const navigate = useNavigate();
  const { promptName } = useParams<{ promptName: string }>();
  const { t } = useTranslation();

  const [searchCategories, setSearchCategories] = useState<SearchCategories>(() => {
    const saved = localStorage.getItem(SEARCH_CATEGORIES_KEY);
    return saved
      ? (JSON.parse(saved) as SearchCategories)
      : { character: true, tag: true, copyright: true };
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setValue('search', promptName ?? '');
  }, [promptName, setValue]);

  useEffect(() => {
    localStorage.setItem(SEARCH_CATEGORIES_KEY, JSON.stringify(searchCategories));
  }, [searchCategories]);

  const handleCategoryChange = (category: Category) => {
    setSearchCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const onSubmit = (data: FormData) => {
    const params = new URLSearchParams();
    if (searchCategories.character) params.append('character', 'true');
    if (searchCategories.tag) params.append('tag', 'true');
    if (searchCategories.copyright) params.append('copyright', 'true');
    const qs = params.toString();
    navigate(`/search/${data.search}${qs ? `?${qs}` : ''}`);
  };

  return (
    <header className="bg-gray-800 text-white p-4 relative w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Link to="/" className="text-white">
            Prompt Supporter
          </Link>
        </h1>
      </div>
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <div className="flex justify-between items-center">
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex gap-2 flex-wrap">
            <div className="flex gap-2 mr-4">
              <input
                {...register('search')}
                type="text"
                className="text-black px-2"
                placeholder={t('common.SearchWord')}
              />
              <Button type="submit" text={t('common.Search')} />
            </div>
            <div className="flex items-center gap-2 mr-4">
              <SearchCategoryCheckbox
                label={t('common.Character')}
                categoryKey="character"
                checked={searchCategories.character}
                onChange={handleCategoryChange}
              />
              <SearchCategoryCheckbox
                label={t('common.Tag')}
                categoryKey="tag"
                checked={searchCategories.tag}
                onChange={handleCategoryChange}
              />
              <SearchCategoryCheckbox
                label={t('common.Copyrights')}
                categoryKey="copyright"
                checked={searchCategories.copyright}
                onChange={handleCategoryChange}
              />
            </div>
          </form>
          <nav>
            <ul className="flex gap-4 mt-2 items-center">
              {[
                { link: '/favorite/character', label: t('common.Character') },
                { link: '/favorite/tag', label: t('common.Tag') },
                { link: '/favorite/copyright', label: t('common.Copyrights') },
                { link: '/create', label: t('common.New Registration') },
              ].map((item) => (
                <li key={item.link}>
                  <Link to={item.link} className="text-white hover:text-gray-300">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  className="flex items-center justify-center bg-transparent border-none p-0"
                  onClick={() => setSettingsOpen(true)}
                  aria-label={t('common.Settings')}
                >
                  ⚙️
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
