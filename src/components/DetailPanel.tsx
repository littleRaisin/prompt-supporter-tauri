import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import FavoriteIcon from './FavoriteIcon';
import Button from './Button';
import { upsertTranslation } from '../db/repository';
import type { Translation } from '../types/Translation';

type DetailPanelProps = {
  item: Translation | null;
  onDataChange: () => void;
};

type TitleWithCopyProps = {
  label: string;
  value?: string;
  onCopy: (value?: string) => void;
};

const TitleWithCopy = ({ label, value, onCopy }: TitleWithCopyProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2 items-center mb-1">
      <p className="font-bold">{label}</p>
      <button
        type="button"
        className="inline-flex items-center justify-center w-6 h-6 p-0 bg-transparent border-none text-gray-400 hover:text-gray-600"
        title={t('common.copyButton')}
        aria-label={t('common.copyButton')}
        onClick={() => onCopy(value)}
      >
        📋
      </button>
    </div>
  );
};

const DetailPanel = ({ item, onDataChange }: DetailPanelProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [favorite, setFavorite] = useState(!!item?.favorite);

  if (!item) return null;

  const handleCopy = (target: string | undefined) => {
    if (!target) return;
    navigator.clipboard.writeText(target).then(() => {
      toast.success(t('common.copiedMessage'));
    }).catch(console.error);
  };

  const handleFavoriteToggle = async () => {
    const newFavorite = favorite ? 0 : 1;
    await upsertTranslation({
      promptName: item.prompt_name,
      translationText: item.translation_text,
      searchWord: item.search_word,
      note: item.note,
      favorite: newFavorite,
      copyrights: item.copyrights,
      category: item.category,
    });
    setFavorite(!!newFavorite);
    toast.success(
      newFavorite
        ? t('common.addedToFavoritesMessage')
        : t('common.removedFromFavoritesMessage')
    );
    onDataChange();
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        {item.translation_text}
        <FavoriteIcon isFavorite={favorite} onClick={() => void handleFavoriteToggle()} />
        <div className="ml-4">
          <Button
            text={t('common.Edit')}
            onClick={() => navigate(`/edit/${item.prompt_name}`)}
          />
        </div>
      </div>

      <div className="mt-3">
        <TitleWithCopy label={t('common.prompt')} value={item.prompt_name} onCopy={handleCopy} />
        <p className="m-1">{item.prompt_name}</p>
      </div>

      {item.category !== 'tag' && (
        <div className="mt-3">
          <TitleWithCopy label={t('common.Copyrights')} value={item.copyrights} onCopy={handleCopy} />
          <p className="m-1">
            <Link to={`/search/${item.copyrights}`} className="underline">
              {item.copyrights}
            </Link>
          </p>
        </div>
      )}

      <div className="whitespace-pre-wrap mt-3">
        <TitleWithCopy label={t('common.Note')} value={item.note} onCopy={handleCopy} />
        <div className="border rounded border-gray-300 p-2 m-1">{item.note}</div>
      </div>
    </div>
  );
};

export default DetailPanel;
