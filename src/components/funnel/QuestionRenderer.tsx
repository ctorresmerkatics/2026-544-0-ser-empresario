import type { AnswerValue, FunnelQuestion } from '../../types';
import { SelectableCard, LikertScale, TextField, TextArea } from '../ui';

interface QuestionRendererProps {
  question: FunnelQuestion;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  showValidation: boolean;
}

/**
 * Traduce el tipo de pregunta (`single-select`, `likert`, `boolean`, `text`) al
 * control de UI correspondiente. Es el único lugar que conoce esa relación —
 * las vistas solo le pasan la pregunta activa y reciben el valor capturado.
 */
export function QuestionRenderer({ question, value, onChange, showValidation }: QuestionRendererProps) {
  const isMissing = showValidation && (value === undefined || value === null || value === '');

  return (
    <div className="animate-fadeIn">
      <h2 className="font-serif text-2xl font-bold leading-snug text-brand-navy sm:text-[1.75rem]">
        {question.prompt}
      </h2>
      {question.helperText && <p className="mt-2 text-brand-ink/60">{question.helperText}</p>}

      <div className="mt-6">
        {question.kind === 'single-select' && (
          <div className="grid gap-3">
            {question.options.map((option) => (
              <SelectableCard
                key={option.value}
                label={option.label}
                selected={value === option.value}
                onSelect={() => onChange(option.value)}
              />
            ))}
          </div>
        )}

        {question.kind === 'boolean' && (
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectableCard
              label={question.trueLabel}
              selected={value === true}
              onSelect={() => onChange(true)}
            />
            <SelectableCard
              label={question.falseLabel}
              selected={value === false}
              onSelect={() => onChange(false)}
            />
          </div>
        )}

        {question.kind === 'likert' && (
          <LikertScale
            value={typeof value === 'number' ? value : null}
            min={question.min}
            max={question.max}
            step={question.step}
            minLabel={question.minLabel}
            maxLabel={question.maxLabel}
            onChange={onChange}
          />
        )}

        {question.kind === 'text' && question.multiline && (
          <TextArea
            label={question.prompt}
            hideLabel
            value={typeof value === 'string' ? value : ''}
            onChange={onChange}
            placeholder={question.placeholder}
            maxLength={question.maxLength}
          />
        )}

        {question.kind === 'text' && !question.multiline && (
          <TextField
            id={question.id}
            label={question.prompt}
            hideLabel
            value={typeof value === 'string' ? value : ''}
            onChange={onChange}
            placeholder={question.placeholder}
            maxLength={question.maxLength}
          />
        )}
      </div>

      {isMissing && (
        <p className="mt-3 text-sm font-medium text-red-500">Selecciona o completa una respuesta para continuar.</p>
      )}
    </div>
  );
}
