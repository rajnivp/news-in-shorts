from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class Messages(db.Model):
    __tablename__ = "Messages"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    message = db.Column(db.String(1000), nullable=False)
    time = db.Column(db.DateTime)

    def __repr__(self):
        return '<Message %r>' % self.id
