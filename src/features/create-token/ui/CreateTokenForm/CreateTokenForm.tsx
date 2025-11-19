import React, { useState, memo } from 'react';
import { ImageUpload } from '../ImageUpload/ImageUpload';
import { useCreateToken } from '../../model/useCreateToken';
import { validateImageFile, tokenFormSchema } from '../../model/validation';
import { TokenFormData } from '../../model/types';
import './CreateTokenForm.css';

interface CreateTokenFormProps {
  onSuccess?: (tokenAddress: string, transactionSignature: string) => void;
  onCreatingChange?: (isCreating: boolean) => void;
}

export const CreateTokenForm: React.FC<CreateTokenFormProps> = memo(({ onSuccess, onCreatingChange }) => {
  const { createToken, isCreating, error: creationError } = useCreateToken();
  
  const [formData, setFormData] = useState<TokenFormData>({
    name: '',
    ticker: '',
    description: '',
    image: null,
    discord: '',
    telegram: '',
    twitter: '',
    website: '',
    buyAmount: 0,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageError, setImageError] = useState<string>('');

  const handleInputChange = (field: keyof TokenFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let value = e.target.value;
    
    if (field === 'ticker') {
      value = value.toUpperCase();
    }
    
    const finalValue = field === 'buyAmount' 
      ? (value === '' ? 0 : Number(value))
      : value;
    
    setFormData(prev => ({ ...prev, [field]: finalValue }));
        if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, image: file }));
    const error = validateImageFile(file);
    setImageError(error || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const imageValidationError = validateImageFile(formData.image);
    if (imageValidationError) {
      setImageError(imageValidationError);
      return;
    }
    
    onCreatingChange?.(true);
    
    try {
      const validatedData = tokenFormSchema.parse({
        name: formData.name,
        ticker: formData.ticker,
        description: formData.description,
        discord: formData.discord || undefined,
        telegram: formData.telegram || undefined,
        twitter: formData.twitter || undefined,
        website: formData.website || undefined,
        buyAmount: typeof formData.buyAmount === 'string' 
          ? (formData.buyAmount === '' ? undefined : Number(formData.buyAmount))
          : formData.buyAmount,
      });
      
      const result = await createToken(formData);
      
      if (result.success && result.tokenAddress && result.transactionSignature) {
        onCreatingChange?.(false);
        onSuccess?.(result.tokenAddress, result.transactionSignature);
      } else {
        onCreatingChange?.(false);
      }
    } catch (err: any) {
      onCreatingChange?.(false);
      if (err.errors && Array.isArray(err.errors)) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error: any) => {
          const field = error.path[0];
          if (field) {
            newErrors[field] = error.message;
          }
        });
        setErrors(newErrors);
        const errorMessages = Object.entries(newErrors)
          .map(([field, message]) => `${field}: ${message}`)
          .join('\n');
        alert(`Please fix the following errors:\n\n${errorMessages}`);
      }
    }
  };

  return (
    <form className="create-token-form" onSubmit={handleSubmit}>
      {Object.keys(errors).length > 0 && (
        <div className="form-error-box">
          <h3>⚠️ Please fix the following errors:</h3>
          <ul>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <strong>{field}:</strong> {message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ImageUpload
        value={formData.image}
        onChange={handleImageChange}
        error={imageError}
      />

      <section className="form-section">
        <h2 className="section-title">1. Basic data</h2>
        <p className="section-description">
          Once your coin/token has been minted, all information becomes immutable and cannot be altered.
        </p>
        
        <div className="form-field">
          <input
            type="text"
            placeholder="Name:"
            value={formData.name}
            onChange={handleInputChange('name')}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>
        
        <div className="form-field">
          <input
            type="text"
            placeholder="Ticker: (e.g. DOGE, BTC - uppercase only)"
            value={formData.ticker}
            onChange={handleInputChange('ticker')}
            className={errors.ticker ? 'error' : ''}
          />
          {errors.ticker && <span className="field-error">{errors.ticker}</span>}
          {!errors.ticker && formData.ticker && (
            <span className="field-hint">✓ Looks good!</span>
          )}
        </div>
        
        <div className="form-field">
          <textarea
            placeholder="Description:"
            value={formData.description}
            onChange={handleInputChange('description')}
            rows={4}
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>
      </section>

      <section className="form-section">
        <h2 className="section-title">2. Social optional data</h2>
        
        <div className="form-field">
          <input
            type="text"
            placeholder="Discord link:"
            value={formData.discord}
            onChange={handleInputChange('discord')}
            className={errors.discord ? 'error' : ''}
          />
          {errors.discord && <span className="field-error">{errors.discord}</span>}
        </div>
        
        <div className="form-field">
          <input
            type="text"
            placeholder="Telegram link:"
            value={formData.telegram}
            onChange={handleInputChange('telegram')}
            className={errors.telegram ? 'error' : ''}
          />
          {errors.telegram && <span className="field-error">{errors.telegram}</span>}
        </div>
        
        <div className="form-field">
          <input
            type="text"
            placeholder="Twitter (X) link:"
            value={formData.twitter}
            onChange={handleInputChange('twitter')}
            className={errors.twitter ? 'error' : ''}
          />
          {errors.twitter && <span className="field-error">{errors.twitter}</span>}
        </div>
        
        <div className="form-field">
          <input
            type="text"
            placeholder="Website link:"
            value={formData.website}
            onChange={handleInputChange('website')}
            className={errors.website ? 'error' : ''}
          />
          {errors.website && <span className="field-error">{errors.website}</span>}
        </div>
      </section>

      <section className="form-section">
        <h2 className="section-title">3. Advanced</h2>
        
        <div className="form-field">
          <input
            type="number"
            placeholder="Buy amount"
            value={formData.buyAmount || ''}
            onChange={handleInputChange('buyAmount')}
            min="0"
            step="0.01"
            className={errors.buyAmount ? 'error' : ''}
          />
          {errors.buyAmount && <span className="field-error">{errors.buyAmount}</span>}
        </div>
      </section>

      {creationError && (
        <div className="form-error">{creationError}</div>
      )}
      
      <button
        type="submit"
        className="submit-button"
        disabled={isCreating}
      >
        {isCreating ? 'Creating...' : 'Create meme'}
      </button>
    </form>
  );
});

CreateTokenForm.displayName = 'CreateTokenForm';
