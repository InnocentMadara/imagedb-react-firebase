import React from 'react'
import "../Styles/Info.scss";

export default function Info() {
  return (
    <div className='info'>
      <div className="container">
        <div className="info__left-block">
          <div className="info__contact info__block">
            <h2 className="info__title">Contact</h2>
            <p className="info__text">+1234567890</p>
            <p className="info__text">+1231231230</p>
            <a href="mailto:" className="info__text info__link">lorem@gmail.com</a>
            <p className="info__text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui, et!</p>
            <a href="https://www.instagram.com/" className="info__text info__link" target="_blank">@instagram</a>
          </div>
          <div className="info__about info__block">
            <h2 className="info__title">About</h2>
            <p className="info__text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque libero laborum nulla facere eum iure at officia, ea, minima nemo sint id vel quaerat, ex similique. Cupiditate aperiam dignissimos optio. Eaque, mollitia corrupti ipsa consequatur inventore similique recusandae doloremque id explicabo nemo esse, ut fugiat veniam sapiente maiores soluta at?</p>
          </div>
        </div>
        <div className="info__right-block">
          <div className="info__clients info__block">
            <h2 className="info__title">Clients</h2>
            <ul className="info__list">
              <li className="info__item">
                <a className="info__link" href="#">
                  W Hotels
                </a>
              </li>
              <li className="info__item">
                <a className="info__link" href="#">
                  Dan Murphy's
                </a>
              </li>
              <li className="info__item">
                <a className="info__link" href="#">
                  Hommey
                </a>
              </li>
            </ul>
          </div>
          <div className="info__features info__block">
            <h2 className="info__title">Features and publications</h2>
            <ul className="info__list">
              <li className="info__item">
                <a className="info__link" href="#">
                  W Hotels
                </a>
              </li>
              <li className="info__item">
                <a className="info__link" href="#">
                  Dan Murphy's
                </a>
              </li>
              <li className="info__item">
                <a className="info__link" href="#">
                  Hommey
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
