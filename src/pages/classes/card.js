import React from 'react'
import style from './card.css'

export default function Card ({ title, children }) {
  return (
    <div className={style['card']}>
      <h3 className={style['card__title']}>{title}</h3>
      {children}
    </div>
  )
}
