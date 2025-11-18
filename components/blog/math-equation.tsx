'use client'

interface MathEquationProps {
  equation: string
  inline?: boolean
}

export function MathEquation({ equation, inline = false }: MathEquationProps) {
  const delimiters = inline ? ['$', '$'] : ['$$', '$$']
  
  return (
    <div className={inline ? 'inline' : 'my-4'}>
      {delimiters[0]}{equation}{delimiters[1]}
    </div>
  )
}
