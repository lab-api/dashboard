from distutils.core import setup
from setuptools import find_packages
import os
setup(
    name='dashboard',
    version='0.1',
    description='Dashboard for LabAPI components',
    author='Robert Fasano',
    author_email='robert.j.fasano@colorado.edu',
    packages=find_packages(exclude=['docs']),
    license='MIT',
    install_requires=['flask', 'attrs']
)
