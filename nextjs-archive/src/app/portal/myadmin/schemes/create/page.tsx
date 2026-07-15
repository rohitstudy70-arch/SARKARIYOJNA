import SchemeForm from '@/components/admin/SchemeForm';

export default function CreateSchemePage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">➕ Nayi Yojana Add Karo</h2>
        <p className="text-sm text-gray-500 mt-1">
          Neeche sabhi zaruri jankari bharo. Title aur Short Description required hai.
        </p>
      </div>
      <SchemeForm />
    </div>
  );
}
