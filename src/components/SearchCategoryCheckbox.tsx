import type { Category } from '../types/Translation';

type SearchCategoryCheckboxProps = {
  label: string;
  categoryKey: Category;
  checked: boolean;
  onChange: (category: Category) => void;
};

const SearchCategoryCheckbox = ({
  label,
  categoryKey,
  checked,
  onChange,
}: SearchCategoryCheckboxProps) => (
  <label className="flex items-center">
    <input
      type="checkbox"
      checked={checked}
      onChange={() => onChange(categoryKey)}
      className="mr-1"
    />
    {label}
  </label>
);

export default SearchCategoryCheckbox;
