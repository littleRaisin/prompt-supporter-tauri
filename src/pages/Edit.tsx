import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import ConfirmModal from '../components/ConfirmModal';
import { getTranslation, upsertTranslation, deleteTranslation } from '../db/repository';
import type { Category } from '../types/Translation';

type FormData = {
  promptName: string;
  translationText?: string;
  searchWord?: string;
  note?: string;
  favorite?: boolean;
  copyrights?: string;
  category?: Category;
};

const Edit = () => {
  const { t } = useTranslation();
  const { promptName } = useParams<{ promptName?: string }>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const selectedCategory = watch('category');
  const [isCopyMode, setIsCopyMode] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (promptName) {
      const trimmed = promptName.trim();
      getTranslation(trimmed)
        .then((data) => {
          if (data) {
            reset({
              promptName: trimmed,
              translationText: data.translation_text,
              searchWord: data.search_word,
              note: data.note,
              favorite: !!data.favorite,
              copyrights: data.copyrights,
              category: data.category ?? 'character',
            });
          }
        })
        .catch(console.error);
    } else {
      setValue('category', 'character');
    }
  }, [promptName, reset, setValue]);

  const handleCopy = async () => {
    if (!promptName) return;
    const data = await getTranslation(promptName.trim());
    if (data) {
      reset({
        promptName: '',
        translationText: data.translation_text,
        searchWord: data.search_word,
        note: data.note,
        favorite: !!data.favorite,
        copyrights: data.copyrights,
        category: data.category ?? 'character',
      });
      setIsCopyMode(true);
    }
  };

  const handleDelete = async () => {
    if (!promptName) return;
    try {
      await deleteTranslation(promptName.trim());
      toast.success(t('common.deletedMessage'));
      navigate('/');
    } catch (err) {
      toast.error(String(err));
    }
  };

  const onSubmit = async (data: FormData) => {
    const trimmed = data.promptName.trim();
    try {
      await upsertTranslation({
        promptName: trimmed,
        translationText: data.translationText,
        searchWord: data.searchWord,
        note: data.note,
        favorite: data.favorite ? 1 : 0,
        copyrights: data.copyrights,
        category: data.category,
      });
      navigate('/search/' + trimmed);
    } catch (err) {
      toast.error(String(err));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">
        {promptName
          ? isCopyMode
            ? t('common.copyAndNewRegistration')
            : t('common.Edit')
          : t('common.New Registration')}
      </h2>

      {promptName && !isCopyMode && (
        <Button
          type="button"
          text={t('common.copyAndNewRegistration')}
          variant="secondary"
          onClick={() => void handleCopy()}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
        <div>
          <label className="block font-semibold">{t('common.promptName')}</label>
          <input
            {...register('promptName', { required: t('common.promptNameRequired') })}
            className="border px-2 py-1 w-full"
            disabled={!!promptName && !isCopyMode}
            placeholder={t('common.enterNewPromptName')}
          />
          {errors.promptName && (
            <p className="text-red-500 text-sm mt-1">{errors.promptName.message}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold">
            {t('common.TranslationText')} ({t('common.Optional')})
          </label>
          <input {...register('translationText')} className="border px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block font-semibold">
            {t('common.SearchWord')} ({t('common.Optional')})
          </label>
          <input {...register('searchWord')} className="border px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block font-semibold">
            {t('common.Note')} ({t('common.Optional')})
          </label>
          <textarea rows={5} {...register('note')} className="border px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block font-semibold">{t('common.Favorite')}</label>
          <input type="checkbox" {...register('favorite')} />
        </div>
        <div>
          <label className="block font-semibold">{t('common.Category')}</label>
          <select {...register('category')} className="border px-2 py-1 w-full">
            <option value="character">{t('common.Character')}</option>
            <option value="copyright">{t('common.Copyrights')}</option>
            <option value="tag">{t('common.Tag')}</option>
          </select>
        </div>

        {selectedCategory !== 'tag' && (
          <div>
            <label className="block font-semibold">{t('common.Copyrights')}</label>
            <input {...register('copyrights')} className="border px-2 py-1 w-full" />
          </div>
        )}

        <div className="flex gap-2">
          <Button type="submit" text={t('common.saveButton')} variant="primary" disabled={isSubmitting} />
          <Button
            type="button"
            text={t('common.cancelButton')}
            variant="secondary"
            onClick={() => navigate(-1)}
          />
          {promptName && !isCopyMode && (
            <Button
              type="button"
              text={t('common.deleteButton')}
              variant="danger"
              onClick={() => setDeleteModalOpen(true)}
            />
          )}
        </div>
      </form>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title={t('common.deleteConfirmTitle')}
        message={t('common.deleteConfirmMessage', { name: promptName })}
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Edit;
